const mongoose = require('mongoose');


// Product listing schema
const buyerrequirementschema = new mongoose.Schema({
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

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Books', 'Other'],
    },

    status: {
        type: String,
        default: "Pending",
        enum: ["Approved", "Rejected", "Pending"]
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    listerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',  
        required: true,
    },
    
    isActive:{
        type:Boolean,
        default:1
    },
    

});

// Ensure updatedAt is updated on every save operation
buyerrequirementschema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('Buyer-Requirement', buyerrequirementschema);
