import numpy as np
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import random
import pickle
from tqdm import tqdm

# --- DB Connection ---
client = MongoClient("mongodb+srv://25100181:MinarMarket123@minarmarket.8lrfq.mongodb.net/")
db = client["MinarMarket"]

# --- Load Data ---
users = list(db["users"].find())
products = list(db["productlistings"].find({"isActive": True, "status": "Approved"}))
transactions = list(db["buyer-messages"].find({"id_of_product": {"$ne": None}}))
interactions = list(db["productinteractions"].find())
searches = list(db["searches"].find())

# --- Mappings ---
user_id_map = {str(user["_id"]): idx for idx, user in enumerate(users)}
product_text_map = {
    str(prod["_id"]): prod.get("title", "") + " " + prod.get("description", "")
    for prod in products
}

# --- Sentence Embeddings ---
model = SentenceTransformer('all-MiniLM-L6-v2')
product_texts = [product_text_map[str(p["_id"])] for p in products]
product_embeddings = model.encode(product_texts, show_progress_bar=True)

product_emb_map = {
    str(prod["_id"]): product_embeddings[i] for i, prod in enumerate(products)
}
product_ids = list(product_emb_map.keys())

# --- Helpers ---
def get_recent_product_ids(user_id, collection, field, max_len):
    items = sorted(
        [c for c in collection if str(c.get("userid", c.get("userId", c.get("id_of_buyer")))) == user_id],
        key=lambda x: x.get("createdAt", x.get("time", None)),
        reverse=True
    )
    product_ids = [str(i[field]) for i in items if i.get(field) and str(i[field]) in product_emb_map]
    return product_ids[:max_len]

global_product_embedding = np.mean(list(product_emb_map.values()), axis=0)

# --- Build Samples ---
X_user_context = []
X_product = []
y = []

positive_samples = [
    ("txn", txn) for txn in transactions
] + [
    ("interaction", inter) for inter in interactions if str(inter.get("productId")) in product_emb_map
]

for source, item in tqdm(positive_samples):
    if source == "txn":
        buyer_id = str(item.get("id_of_buyer"))
        product_id = str(item.get("id_of_product"))
    else:
        buyer_id = str(item.get("userId"))
        product_id = str(item.get("productId"))

    if buyer_id not in user_id_map or product_id not in product_emb_map:
        continue

    # Build context
    recent_txns = get_recent_product_ids(buyer_id, transactions, "id_of_product", 10)
    recent_inters = get_recent_product_ids(buyer_id, interactions, "productId", 10)
    recent_searches = [
        s["search_query"] for s in sorted(
            [s for s in searches if str(s.get("userid")) == buyer_id],
            key=lambda x: x.get("time", x.get("createdAt")),
            reverse=True
        )
    ][:10]

    context_texts = [product_text_map[pid] for pid in recent_txns + recent_inters if pid in product_text_map] + recent_searches

    if context_texts:
        context_embedding = np.mean(model.encode(context_texts), axis=0)
    else:
        context_embedding = global_product_embedding

    # Positive Sample
    X_user_context.append(context_embedding)
    X_product.append(product_emb_map[product_id])
    y.append(1)

    # Negative Sample
    for _ in range(1):  # 1:1 negative sampling
        rand_pid = random.choice(product_ids)
        if rand_pid != product_id:
            X_user_context.append(context_embedding)
            X_product.append(product_emb_map[rand_pid])
            y.append(0)

# --- Save ---
with open("python/dataset.pkl", "wb") as f:
    pickle.dump((np.array(X_user_context), np.array(X_product), np.array(y)), f)

print("Dataset saved to dataset.pkl")
