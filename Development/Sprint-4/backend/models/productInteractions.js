const mongoose = require("mongoose");

const productInteractionSchema = new mongoose.Schema({
  userId: {
    type: String, // Removed ObjectId and ref
    required: true,
  },
  productId: {
    type: String, // Removed ObjectId and ref
    required: true,
  },
  time: {
    type: Date,
    default: Date.now, // Always uses current time
  },
});

module.exports = mongoose.model("ProductInteraction", productInteractionSchema);
