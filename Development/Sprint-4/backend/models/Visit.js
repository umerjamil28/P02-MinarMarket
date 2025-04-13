const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true }, // Stores browser & device details
  timestamp: { type: Date, default: Date.now },
  date: { type: String, required: true }, // Stores visit date in YYYY-MM-DD format
  page: { type: Number, required: true }, // Stores the page number
});

// Ensure a unique visit per IP + User-Agent per day
// visitSchema.index({ userId: 1, ipAddress: 1, userAgent: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Visit", visitSchema);
