// const express = require("express");
// const { getSellerMessages } = require("../controllers/BuyerMessagesToSellers"); // Import function
// const router = express.Router();

// // Define route to get messages for a seller
// router.get("/:sellerId", getSellerMessages);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {getSellerMessages, updateMessageStatus} = require("../controllers/BuyerMessagesToSellers");

// Route to get messages for a seller
router.get("/:sellerId", getSellerMessages);

// Route to update message status
router.patch("/:messageId", updateMessageStatus);

module.exports = router;
