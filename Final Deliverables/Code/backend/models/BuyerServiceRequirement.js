const mongoose = require("mongoose");

// Image schema for the service
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

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
    default: "Per Hour",
    enum: ["Per Hour", "Per Day", "Per Job"],
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Haircut",
      "Plumbing",
      "Carpentry",
      "Electrical",
      "Gardening",
      "Catering",
      "House Help",
      "Web Development",
      "Design",
      "Other",
    ],
  },
  city: {
    type: String,
    required: true,
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
  isActive: {
    type: Boolean,
    default: true,
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

// Update timestamps on save
buyerServiceRequirementSchema.pre("save", async function(next){
    this.updatedAt = Date.now();

    const User = require("./User");

    const user = await User.findById(this.listerId).select("accountStatus");

    if(user) {
        this.listerAccountStatus = user.accountStatus;
    }
})

module.exports = mongoose.model(
  "BuyerServiceRequirement",
  buyerServiceRequirementSchema
);
