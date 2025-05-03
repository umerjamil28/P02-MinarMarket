const express = require("express");
const BuyerMessage = require("../models/BuyerMessages");
const User = require("../models/User");
const ProductListing = require("../models/ProductListing");
const ServiceListing = require("../models/ServiceListing");

// Fetch messages for a seller
exports.getSellerMessages = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res
        .status(400)
        .json({ success: false, message: "Seller ID is required." });
    }

    const messages = await BuyerMessage.find({ id_of_lister: sellerId });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found for this seller.",
      });
    }

    // Fetch buyer details and corresponding product/service names
    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const buyer = await User.findById(message.id_of_buyer).select(
          "name email phone"
        );

        let listingTitle = "Unknown Listing";

        if (message.id_of_product) {
          const product = await ProductListing.findById(message.id_of_product);
          if (product) listingTitle = product.title;
        } else if (message.id_of_service) {
          const service = await ServiceListing.findById(message.id_of_service);
          if (service) listingTitle = service.title;
        }

        // console.log("Listing Title:", listingTitle);

        return {
          id: message._id,
          title: listingTitle,
          name: buyer ? buyer.name : "Unknown Buyer",
          email: buyer ? buyer.email : "Unknown Email",
          phone: buyer ? buyer.phone : "Unknown Phone",
          createdAt: message.createdAt,
          status: message.status,
          buyerId: message.id_of_buyer,
          category: message.category,
        };
      })
    );

    return res.status(200).json({ success: true, messages: enrichedMessages });
  } catch (error) {
    console.error("Error fetching seller messages:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching messages.",
    });
  }
};


exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { sellerId, buyerId, status } = req.body;

    if (!sellerId || !buyerId || !messageId || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update chatConnections in parallel using Promise.all
    await Promise.all([
      User.findByIdAndUpdate(
        sellerId,
        { $addToSet: { chatConnections: buyerId } }, // Add buyerId to seller's chatConnections
        { new: true }
      ),
      User.findByIdAndUpdate(
        buyerId,
        { $addToSet: { chatConnections: sellerId } }, // Add sellerId to buyer's chatConnections
        { new: true }
      ),
    ]);

    const updatedMessage = await BuyerMessage.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    if (!updatedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    // Now you can continue updating the message status if needed (depends on your app logic)

    return res
      .status(200)
      .json({ success: true, message: "Status updated successfully." });
  } catch (error) {
    console.error("Error updating message status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
