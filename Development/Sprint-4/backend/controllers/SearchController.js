const { searchProducts, searchServices, combinedSearch, quickSearch } = require('../utils/vectorSearch');
const Search = require('../models/Search');
const { spawn } = require("child_process");
const User = require("../models/User");

// Helper function to store search query for logged-in users
const storeUserSearch = async (userId, query) => {
  if (userId) {
    try {
      await Search.create({
        userid: userId,
        search_query: query
      });

      console.log("going in 4")
    // Trigger inference after interaction
    const python = spawn("python3", ["python/infer_and_update.py", userId]);
    
    python.stdout.on("data", (data) => {
      console.log(`Python output: ${data}`);
    });

    python.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    python.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
    });


    } catch (error) {
      console.error('Error storing search query:', error);
      // Just log the error without affecting the search response
    }
  }
};

// Handler for combined search (both products and services)
exports.search = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    const userId = req.user?.id || req.query.userId || null;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    // Store search query if user is logged in
    if (userId) {
      await storeUserSearch(userId, q);
    }

    const results = await combinedSearch(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error('Error in search controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Handler for quick search (autocomplete/suggestions)
exports.quickSearch = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    const userId = req.user?.id || req.query.userId || null;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    // // Store search query if user is logged in
    // if (userId) {
    //   await storeUserSearch(userId, q);
    // }

    const suggestions = await quickSearch(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      suggestions: suggestions
    });
  } catch (error) {
    console.error('Error in quick search controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Handler for products search
exports.searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    const userId = req.user?.id || req.query.userId || null;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    // Store search query if user is logged in
    if (userId) {
      await storeUserSearch(userId, q);
    }

    const products = await searchProducts(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error in products search controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Handler for services search
exports.searchServices = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    const userId = req.user?.id || req.query.userId || null;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required' 
      });
    }

    // Store search query if user is logged in
    if (userId) {
      await storeUserSearch(userId, q);
    }

    const services = await searchServices(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error('Error in services search controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};
