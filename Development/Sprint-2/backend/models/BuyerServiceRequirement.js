const mongoose = require('mongoose');

const buyerServiceRequirementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 200,
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
    },
    pricingModel: {
        type: String,
        default: 'Per Hour',
        enum: ["Per Hour", "Per Day", "Per Job"],
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Approved", "Rejected", "Pending"]
    },
    listerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('BuyerServiceRequirement', buyerServiceRequirementSchema);