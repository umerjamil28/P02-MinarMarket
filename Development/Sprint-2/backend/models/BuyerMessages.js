const mongoose = require('mongoose');


// Product listing schema
const buyermessagesschema = new mongoose.Schema({
    id_of_buyer: {
        type: String,
        required: true,
        trim: true,
    },

    id_of_product: {
        type: String,
        required: true,
        maxlength: 200,
    },

    status: {
        type: String,
        default: "Pending",
        enum: ["Yes", "No", "Pending"]
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },

    id_of_lister: {
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
buyermessagesschema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('Buyer-Messages', buyermessagesschema);
