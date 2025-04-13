const express = require("express");
const router = express.Router();
const {getSellerMessages, updateMessageStatus} = require("../controllers/BuyerMessagesToSellers");

// Route to get messages for a seller
router.get("/:sellerId", getSellerMessages);

// Route to update message status
router.post("/:messageId", updateMessageStatus);

module.exports = router;