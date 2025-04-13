const mongoose = require("mongoose");

const productEmbeddingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductListing", required: true },
  imageUrl: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

const ProductEmbedding = mongoose.model("ProductEmbedding", productEmbeddingSchema);

module.exports = ProductEmbedding;
