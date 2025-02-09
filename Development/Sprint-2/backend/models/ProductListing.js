const mongoose = require('mongoose');

// Image schema for the product
const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

// Product listing schema
const productListingSchema = new mongoose.Schema({
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
        // enum: ['Electronics', 'Clothing', 'Books', 'Other'],
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Approved", "Rejected", "Pending"]
    }
    ,
    images: {
        type: [imageSchema],
        validate: {
            validator: (images) => images.length <= 6,
            message: 'A maximum of 6 images can be uploaded.',
        },
        required: true,
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
productListingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('ProductListing', productListingSchema, 'productlistings');

