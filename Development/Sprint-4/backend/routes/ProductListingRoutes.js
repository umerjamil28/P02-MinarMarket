const express = require('express');
const router = express.Router();

const {addProductListing,showProductListings, showMyProductListings, fetchProductListing, updateProductListing, showProductCategoryListings, fetchLandingPageProducts, fetchCategoryLandingPage, getRecommendedProducts, getEmbedding} = require('../controllers/ProductListingController');
const { addEmbedding } = require('../middleware/embeddingMiddleware');

// console.log("ITHAY AAN");
router.post('/', addEmbedding, addProductListing);
router.get('/',showProductListings);
router.post('/buyer/my-product-listings', showMyProductListings)
router.get('/fetch-product-details/:productId', fetchProductListing);
router.put('/updateProduct/:productId', addEmbedding, updateProductListing);
router.post('/fetch-category/:category', showProductCategoryListings);
router.get('/fetch-landing-page-products', fetchLandingPageProducts);
router.get('/fetch-category-landing-page/:category', fetchCategoryLandingPage);

router.post('/recommendedproducts',getRecommendedProducts )
router.post('/images',getEmbedding)
// router.post('/proposals', addProposal);
// router.post('/proposals/buyer', getProposalsByBuyer);
// router.post('/proposals/seller', getProposalsBySeller);

module.exports = router;
