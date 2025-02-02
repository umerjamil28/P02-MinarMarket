const express = require('express');
const router = express.Router();

const { getSellerProductListings, getSellerServicesListings } = require('../controllers/SellerListingController');

// Route to get seller listings by user ID
router.get('/', getSellerProductListings);
router.get('/get-seller-services-listings/:userId', getSellerServicesListings);

module.exports = router;
