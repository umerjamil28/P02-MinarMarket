from sentence_transformers import SentenceTransformer
from pymongo import MongoClient
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from datetime import datetime
import tqdm
import spacy

# Load sentence transformer model
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')

# Load spaCy English model for POS tagging
nlp = spacy.load("en_core_web_sm")

# Connect to MongoDB (your cloud instance)
client = MongoClient("mongodb+srv://25100181:MinarMarket123@minarmarket.8lrfq.mongodb.net/")
db = client["MinarMarket"]
products_collection = db['productlistings']
similar_collection = db['SimilarProducts']

# Helper function: extract only nouns and adjectives from a sentence
def extract_keywords(text):
    doc = nlp(text)
    keywords = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ']]
    return ' '.join(keywords)

# Fetch all active and approved products
products_cursor = list(products_collection.find({
    "isActive": True,
    "status": "Approved"
}))

# Step 1: Embed all products (title + filtered description)
product_embeddings = []
product_ids = []

for product in tqdm.tqdm(products_cursor, desc="Embedding products"):
    title = product.get('title', '')
    raw_desc = product.get('description', '')
    filtered_desc = extract_keywords(raw_desc)
    text = f"{title}. {filtered_desc}"
    embedding = model.encode(text, normalize_embeddings=True)
    product_embeddings.append(embedding)
    product_ids.append(product['_id'])

product_embeddings = np.array(product_embeddings)

# Step 2: Compute similarity and store top 6 similar for each product
for idx, (product_id, embedding) in tqdm.tqdm(enumerate(zip(product_ids, product_embeddings)), total=len(product_ids), desc="Computing similarities"):
    similarities = cosine_similarity([embedding], product_embeddings)[0]
    top_indices = similarities.argsort()[-7:][::-1]
    top_indices = [i for i in top_indices if product_ids[i] != product_id][:6]

    similar_products = [
        {
            "productId": product_ids[i],
            "similarityScore": float(similarities[i])
        }
        for i in top_indices
    ]

    similar_collection.replace_one(
        {"productId": product_id},
        {
            "productId": product_id,
            "embedding": embedding.tolist(),
            "similarProducts": similar_products,
            "createdAt": datetime.utcnow()
        },
        upsert=True
    )

print("✅ SimilarProducts table created with keyword-based descriptions.")
