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

const serviceListingSchema = new mongoose.Schema({
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
    category:{
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
    },
    pricingModel:{
        type: String,
        default: 'Per Hour',
        enum:["Per Hour", "Per Day", "Per Job"],
        required:true
    },
    city:{
        type: String,
        required: true
    },
    availability:{
        type:Boolean,
        default:1
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
    status: {
        type: String,
        default: "Pending",
        enum: ["Approved", "Rejected", "Pending"]
    },
    images: {
        type: [imageSchema],
        validate: {
            validator: (images) => images.length <= 6,
            message: 'A maximum of 6 images can be uploaded.',
        },
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure updatedAt is updated on every save operation
serviceListingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


module.exports = mongoose.model('ServiceListing', serviceListingSchema, 'servicelistings');
