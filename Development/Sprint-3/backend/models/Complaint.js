const mongoose = require("mongoose");
const User = require('./User');

const complaintSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    complaintType: { type: String, enum: ["Fraud", "Harassment", "Spam", "Other"], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Under Review", "Resolved", "Rejected"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null },
    adminNotes: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
