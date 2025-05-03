const mongoose = require("mongoose");

// Define image schema (same as in ProductListing)
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

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
    enum: ["Electronics", "Clothing", "Books", "Footwear", "Furniture", "Beauty and Personal Care", "Toys", "Other"],
  },

  // Add images field
  images: {
    type: [imageSchema],
    validate: {
      validator: (images) => !images || images.length <= 6,
      message: "A maximum of 6 images can be uploaded.",
    },
    default: [],
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Approved", "Rejected", "Pending"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: 1,
  },

  listerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  listerAccountStatus: {
    type: String,
    default: "Active",
    enum: ["Active", "Suspended", "Banned"],
  },
});

// Ensure updatedAt is updated on every save operation
buyerrequirementschema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  const User = require("../models/User"); // Move require inside the function to avoid circular dependency
  
  const user = await User.findById(this.listerId).select("accountStatus");
  if (user) {
    this.listerAccountStatus = user.accountStatus;
  }

  next();
});

// Export the model
module.exports = mongoose.model("Buyer-Requirement", buyerrequirementschema);
