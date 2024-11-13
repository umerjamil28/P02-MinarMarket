const express = require('express');
const router = express.Router();

const { getSellerListings } = require('../controllers/SellerListingController');

// Route to get seller listings by user ID
router.get('/', getSellerListings);

module.exports = router;
