const express = require('express');
const router = express.Router();

const {addProductListing,showProductListings} = require('../controllers/ProductListingController');

// console.log("ITHAY AAN");
router.post('/', addProductListing);
router.get('/',showProductListings);


module.exports = router;