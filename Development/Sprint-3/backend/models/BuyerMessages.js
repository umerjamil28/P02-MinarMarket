const mongoose = require("mongoose");

const buyermessagesschema = new mongoose.Schema({
    id_of_buyer: {
        type: String,
        required: true,
        trim: true,
    },

    id_of_product: {
        type: String,
        maxlength: 200,
        default: null, 
    },

    id_of_service: {
        type: String,
        maxlength: 200,
        default: null, 
    },

    status: {
        type: String,
        default: "Pending",
        enum: ["Yes", "No", "Pending"],
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
        ref: "users",
        required: true,
    },

    isActive: {
        type: Boolean,
        default: 1,
    },
});

// Ensure at least one of `id_of_product` or `id_of_service` is provided
buyermessagesschema.pre("validate", function (next) {
    if (!this.id_of_product && !this.id_of_service) {
        return next(new Error("Either id_of_product or id_of_service is required."));
    }
    next();
});

// Ensure updatedAt is updated on every save operation
buyermessagesschema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model("Buyer-Messages", buyermessagesschema);
