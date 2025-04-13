

import sys
import numpy as np
import pickle
from pymongo import MongoClient
from bson import ObjectId
from sentence_transformers import SentenceTransformer
from tensorflow.keras.models import load_model

# --- Setup ---
print("Initializing...")
client = MongoClient("mongodb+srv://25100181:MinarMarket123@minarmarket.8lrfq.mongodb.net/")
db = client["MinarMarket"]

# Load model & embedder
model = load_model("python/recommender_model.h5")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Load precomputed product embeddings array
with open("python/dataset.pkl", "rb") as f:
    _, product_embeddings_array, _ = pickle.load(f)

# Get user_id from CLI args
if len(sys.argv) < 2:
    print("User ID required as argument")
    sys.exit(1)

user_id = sys.argv[1]
print(f"Running recommendation for user: {user_id}")

# Fetch all active products
products = list(db["productlistings"].find({"isActive": True, "status": "Approved"}))
if not products:
    print("No products found.")
    sys.exit(1)


# Build product text and embeddings
product_text_map = {
    str(prod["_id"]): prod.get("title", "") + " " + prod.get("description", "")
    for prod in products
}
product_emb_map = {
    str(prod["_id"]): embedder.encode(product_text_map[str(prod["_id"])])
    for prod in products
}


# --- Helper Function ---
def get_user_context_embedding(user_id):
    transactions = list(db["buyer-messages"].find({"id_of_buyer": user_id, "id_of_product": {"$ne": None}}))
    interactions = list(db["productinteractions"].find({"userId": user_id}))
    searches = list(db["searches"].find({"userid": ObjectId(user_id)}))

    txn_ids = [str(t["id_of_product"]) for t in sorted(transactions, key=lambda x: x.get("createdAt", 0), reverse=True)]
    inter_ids = [str(i["productId"]) for i in sorted(interactions, key=lambda x: x.get("time", 0), reverse=True)]
    search_queries = [s["search_query"] for s in sorted(searches, key=lambda x: x.get("time", 0), reverse=True)]
    
    txn_ids = txn_ids[:10]
    inter_ids = inter_ids[:10]
    search_queries = search_queries[:10]

    context_texts = []

    for pid in txn_ids + inter_ids:
        if pid in product_text_map:
            context_texts.append(product_text_map[pid])

    context_texts += search_queries
    if not context_texts:
        context_texts = [""]

    context_emb = np.mean(embedder.encode(context_texts), axis=0)
    return context_emb

# --- Inference ---
try:
    user_emb = get_user_context_embedding(user_id)

    scores = []
    product_ids = []

    for pid, prod_emb in product_emb_map.items():
        score = model.predict([np.array([user_emb]), np.array([prod_emb])])[0][0]
        scores.append(score)
        product_ids.append(pid)

    top_k = 6
    top_indices = np.argsort(scores)[::-1][:top_k]
    top_product_ids = np.array(product_ids)[top_indices]

    recommended_products = [db["productlistings"].find_one({"_id": ObjectId(pid)}) for pid in top_product_ids]

    # Update in DB
    db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"recommendedProducts": [ObjectId(pid) for pid in top_product_ids]}}
    )

    print("Recommended product IDs updated in DB:")
    for prod in recommended_products:
        print(f" - {prod['title']} | {prod['description']}")

except Exception as e:
    print("Error during inference:", e)
    sys.exit(1)
