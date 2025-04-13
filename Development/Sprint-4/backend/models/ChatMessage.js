const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
