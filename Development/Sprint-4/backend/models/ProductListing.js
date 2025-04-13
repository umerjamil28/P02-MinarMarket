const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const productListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Books", "Footwear", "Furniture", "Beauty and Personal Care", "Toys", "Other"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Approved", "Rejected", "Pending"],
  },
  images: {
    type: [imageSchema],
    validate: {
      validator: (images) => images.length <= 6,
      message: "A maximum of 6 images can be uploaded.",
    },
    required: true,
  },
  embedding: {
    type: [Number],
    index: true,
    sparse: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  listerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  listerAccountStatus: {
    type: String,
    default: "Active",
    enum: ["Active", "Suspended", "Banned"],
  }, // Auto-updated field
  isActive: { type: Boolean, default: 1 },
});

// Middleware to update `listerAccountStatus` before saving
productListingSchema.pre("save", async function (next) {
  this.updatedAt = Date.now(); // Always update `updatedAt`
  
  // Lazy load User model inside the hook to avoid circular dependency
  const User = require("../models/User");

  const user = await User.findById(this.listerId).select("accountStatus");
  if (user) {
    this.listerAccountStatus = user.accountStatus; // Automatically set from User Schema
  }

  next();
});

module.exports = mongoose.model(
  "ProductListing",
  productListingSchema,
  "productlistings"
);
