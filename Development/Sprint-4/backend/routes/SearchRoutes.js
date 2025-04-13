const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

// Route for full search (returns products and services)
router.get('/search', searchController.search);

// Route for quick search (for autocomplete/suggestions)
router.get('/quick-search', searchController.quickSearch);

// Route for products search
router.get('/products', searchController.searchProducts);

// Route for services search
router.get('/services', searchController.searchServices);

module.exports = router;
