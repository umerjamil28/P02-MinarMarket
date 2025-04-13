const express = require("express");
const router = express.Router();

const { createBuyerMessage, checkBuyerMessage } = require("../controllers/BuyerMessages");

// Route for listing a product
router.post("/", createBuyerMessage);

router.get("/check", checkBuyerMessage);

module.exports = router;
