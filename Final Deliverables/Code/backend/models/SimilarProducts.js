const mongoose = require('mongoose');

const similarProductSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductListing',
      required: true,
      unique: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    similarProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ProductListing',
          required: true,
        },
        similarityScore: {
          type: Number,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }, { collection: 'SimilarProducts' });
  
  module.exports = mongoose.model('SimilarProducts', similarProductSchema);
  
