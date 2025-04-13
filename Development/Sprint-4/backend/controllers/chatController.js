const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");


exports.saveMessage = async (data) => {
  try {
    const { senderId, receiverId, message } = data;

    if (!senderId || !receiverId || !message) {
      throw new Error("SenderID or ReceiverID or Message is missing");
    }

    const newMessage = new ChatMessage({ senderId, receiverId, message });
    const savedMessage = await newMessage.save();

    return savedMessage;
  } catch (err) {
    console.error("Error saving message through socket:", err);
    throw err;
  }
};


exports.getChatConnection = async (req, res) => {
  try {
    const { myId } = req.body;

    if (!myId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Fetch the user and populate the 'chatConnections' array
    const user = await User.findById(myId).select("chatConnections").populate({
      path: "chatConnections", // populate the array
      select: "name", // only get the 'name' field
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Now, user.chatConnections will be an array of { _id, name } objects
    const chatConnections = user.chatConnections.map((connection) => ({
      id: connection._id,
      name: connection.name,
    }));

    return res.status(200).json({ success: true, chatConnections });
  } catch (error) {
    console.error("Error fetching chat connections:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// Controller to fetch chat messages between two users
exports.fetchChatMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({ success: false, message: "User IDs are required" });
    }

    // Find all messages between the two users
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ]
    }).sort({ createdAt: 1 }); // sort by time ascending

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ success: false, message: "Server error while fetching messages" });
  }
};