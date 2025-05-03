def update_similar_products_for_new_product(new_product):
    from sentence_transformers import SentenceTransformer
    from pymongo import MongoClient
    from sklearn.metrics.pairwise import cosine_similarity
    from datetime import datetime
    import numpy as np
    import spacy
    from bson import ObjectId  # For handling MongoDB ObjectId

    # Models
    model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
    nlp = spacy.load("en_core_web_sm")

    # MongoDB
    client = MongoClient("mongodb+srv://25100181:MinarMarket123@minarmarket.8lrfq.mongodb.net/")
    db = client["MinarMarket"]
    product_collection = db["ProductListing"]
    similar_collection = db["SimilarProducts"]

    def extract_keywords(text):
        doc = nlp(text)
        return ' '.join([token.text for token in doc if token.pos_ in ['NOUN', 'ADJ']])

    # Step 1: Compute embedding for new product
    title = new_product.get('title', '')
    raw_desc = new_product.get('description', '')
    filtered_desc = extract_keywords(raw_desc)
    combined_text = f"{title}. {filtered_desc}"
    new_embedding = model.encode(combined_text, normalize_embeddings=True)

    # Ensure new_product_id is an ObjectId
    new_product_id = new_product['_id']
    if isinstance(new_product_id, str):
        new_product_id = ObjectId(new_product_id)

    # Step 2: Store embedding and top 6 similar products
    all_similar_products = list(similar_collection.find())
    existing_embeddings = np.array([item['embedding'] for item in all_similar_products])
    existing_ids = [item['productId'] for item in all_similar_products]

    if len(existing_embeddings) == 0:
        print("⚠️ No similar products exist. Skipping update.")
        return

    similarities = cosine_similarity([new_embedding], existing_embeddings)[0]
    top_indices = similarities.argsort()[-6:][::-1]

    similar_products_to_new = []
    
    for i in top_indices:
        product_id = existing_ids[i]

        # Ensure product_id is ObjectId
        if isinstance(product_id, str):
            product_id = ObjectId(product_id)

        # Skip if same product
        if product_id == new_product_id:
            continue

        similar_products_to_new.append({
            "productId": product_id,
            "similarityScore": float(similarities[i])
        })
    similar_products_to_new = similar_products_to_new[:6]
    # Add self-similarity
    similar_products_to_new.append({
        "productId": new_product_id,
        "similarityScore": float(similarities[0])
    })

    similar_collection.replace_one(
        {"productId": new_product_id},
        {
            "productId": new_product_id,
            "embedding": new_embedding.tolist(),
            "similarProducts": similar_products_to_new,
            "createdAt": datetime.utcnow()
        },
        upsert=True
    )

    # Step 3: Update others' similar lists
    for existing_product in all_similar_products:
        existing_id = existing_product['productId']
        if isinstance(existing_id, str):
            existing_id = ObjectId(existing_id)

        existing_embedding = np.array(existing_product['embedding'])
        similarity_score = float(cosine_similarity([new_embedding], [existing_embedding])[0][0])

        current_similars = existing_product.get('similarProducts', [])
        existing_similar_ids = [s['productId'] for s in current_similars]

        if new_product_id in existing_similar_ids:
            continue

        if len(current_similars) < 6:
            current_similars.append({
                "productId": new_product_id,
                "similarityScore": similarity_score
            })
        else:
            min_sim = min(current_similars, key=lambda x: x['similarityScore'])
            if similarity_score > min_sim['similarityScore']:
                current_similars.remove(min_sim)
                current_similars.append({
                    "productId": new_product_id,
                    "similarityScore": similarity_score
                })

        current_similars = sorted(current_similars, key=lambda x: x['similarityScore'], reverse=True)

        similar_collection.update_one(
            {"productId": existing_id},
            {"$set": {
                "similarProducts": current_similars
            }}
        )

    print(f"✅ SimilarProducts updated with new product: {new_product_id}")

if __name__ == "__main__":
    import sys
    import json
    from bson import ObjectId

    class ObjectIdDecoder(json.JSONDecoder):
        def __init__(self, *args, **kwargs):
            super().__init__(object_hook=self.object_hook, *args, **kwargs)

        def object_hook(self, obj):
            if '_id' in obj and isinstance(obj['_id'], str):
                try:
                    obj['_id'] = ObjectId(obj['_id'])
                except:
                    pass
            return obj

    new_product = json.loads(sys.stdin.read(), cls=ObjectIdDecoder)
    update_similar_products_for_new_product(new_product)
