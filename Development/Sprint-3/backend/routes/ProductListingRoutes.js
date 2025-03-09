const express = require('express');
const router = express.Router();

const {addProductListing,showProductListings, showMyProductListings, fetchProductListing, updateProductListing, showProductCategoryListings, fetchLandingPageProducts, fetchCategoryLandingPage} = require('../controllers/ProductListingController');
// const { addProposal, getProposalsByBuyer, getProposalsBySeller } = require('../controllers/ProposalController');

// console.log("ITHAY AAN");
router.post('/', addProductListing);
router.get('/',showProductListings);
router.post('/buyer/my-product-listings', showMyProductListings)
router.get('/fetch-product-details/:productId', fetchProductListing);
router.put('/updateProduct/:productId', updateProductListing);
router.post('/fetch-category/:category', showProductCategoryListings);
router.get('/fetch-landing-page-products', fetchLandingPageProducts);
router.get('/fetch-category-landing-page/:category', fetchCategoryLandingPage);
// router.post('/proposals', addProposal);
// router.post('/proposals/buyer', getProposalsByBuyer);
// router.post('/proposals/seller', getProposalsBySeller);

module.exports = router;