const mongoose = require('mongoose');




// Buyer bid schema
const buyerBidSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductListing',
        required: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',  // Assuming you have a User model for the buyer
        required: true,
    },
    bidPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    bidStatus: {
        type: String,
        default: "Pending",
        enum: ["Accepted", "Rejected", "Pending"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Ensure updatedAt is updated on every save operation
buyerBidSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('BuyerBid', buyerBidSchema);