const { createEmbedding, EMBEDDING_DIMENSION } = require("./embeddingService").default;
const ProductListing = require("../models/ProductListing");
const ServiceListing = require("../models/ServiceListing");
const mongoose = require("mongoose");

// Search for products based on query using MongoDB vector search
async function searchProducts(queryText, limit = 10) {
  try {
    // Generate embedding for the search query
    const queryEmbedding = await createEmbedding(queryText);

    if (!queryEmbedding) {
      throw new Error("Failed to create query embedding");
    }

    // Using MongoDB Atlas $vectorSearch stage directly
    const pipeline = [
      {
        $vectorSearch: {
          // Use $vectorSearch directly
          index: "productSearchIndex",
          queryVector: queryEmbedding,
          path: "embedding",
          numCandidates: limit * 2, // Number of candidates to consider
          limit: limit, // Number of results to return
          filter: {
            // Use MQL syntax for filtering
            $and: [
              {
                status: {
                  $eq: "Approved",
                },
              }, // MQL filter for status

              {
                isActive: {
                  $eq: true,
                },
              }, // MQL filter for isActive
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          category: 1,
          images: 1,
          createdAt: 1,
          listerId: 1,
          score: { $meta: "vectorSearchScore" }, // Use vectorSearchScore
        },
      },
      // The $limit stage might be redundant if limit is specified in $vectorSearch
      // { $limit: limit }
    ];

    const products = await ProductListing.aggregate(pipeline);

    // If no results with vector search, fall back to text search
    if (products.length === 0) {
      return fallbackTextSearch(ProductListing, queryText, limit);
    }

    return products;
  } catch (error) {
    console.error("Error in vector search for products:", error);

    // Fallback to traditional text search if vector search fails
    return fallbackTextSearch(ProductListing, queryText, limit);
  }
}
/**'''{
  "name": "productSearchIndex",
  "definition": {
    "mappings": {
      "dynamic": false,
      "fields": {
        "embedding": {
          "dimensions": 384,
          "similarity": "cosine",
          "type": "knnVector"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "category": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "isActive": {
          "type": "boolean"
        }
      }
    }
  }
}'''
'''{
  "name": "serviceSearchIndex",
  "definition": {
    "mappings": {
      "dynamic": false,
      "fields": {
        "embedding": {
          "dimensions": 384,
          "similarity": "cosine",
          "type": "knnVector"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "category": {
          "type": "string"
        },
        "status": {
          "type": "string"
        },
        "isActive": {
          "type": "boolean"
        }
      }
    }
  }
}''' */

// Search for services based on query using MongoDB vector search
async function searchServices(queryText, limit = 10) {
  try {
    // Generate embedding for the search query
    const queryEmbedding = await createEmbedding(queryText);

    if (!queryEmbedding) {
      throw new Error("Failed to create query embedding");
    }

    // Using MongoDB Atlas $vectorSearch stage directly
    const pipeline = [
      {
        $vectorSearch: {
          // Use $vectorSearch directly
          index: "serviceSearchIndex",
          queryVector: queryEmbedding,
          path: "embedding",
          numCandidates: limit * 2, // Number of candidates to consider
          limit: limit, // Number of results to return
          filter: {
            // Use MQL syntax for filtering
            $and: [
              {
                status: {
                  $eq: "Approved",
                },
              }, // MQL filter for status

              {
                isActive: {
                  $eq: true,
                },
              }, // MQL filter for isActive
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          rate: 1,
          pricingModel: 1,
          city: 1,
          images: 1,
          createdAt: 1,
          listerId: 1,
          score: { $meta: "vectorSearchScore" }, // Use vectorSearchScore
        },
      },
      // The $limit stage might be redundant if limit is specified in $vectorSearch
      // { $limit: limit }
    ];

    const services = await ServiceListing.aggregate(pipeline);

    // If no results with vector search, fall back to text search
    if (services.length === 0) {
      return fallbackTextSearch(ServiceListing, queryText, limit);
    }

    return services;
  } catch (error) {
    console.error("Error in vector search for services:", error);

    // Fallback to traditional text search if vector search fails
    return fallbackTextSearch(ServiceListing, queryText, limit);
  }
}

// Fallback text search when embeddings aren't available
async function fallbackTextSearch(model, queryText, limit = 10) {
  console.log("Falling back to text search for:", queryText);

  // Create a text search query that looks for the terms in title and description
  const query = {
    $or: [
      { title: { $regex: queryText, $options: "i" } },
      { description: { $regex: queryText, $options: "i" } },
      { category: { $regex: queryText, $options: "i" } },
    ],
    status: "Approved",
    isActive: true,
  };

  return model.find(query).limit(limit);
}

// Combined search (products and services)
async function combinedSearch(queryText, limit = 20) {
  try {
    // Split the limit between products and services
    const productLimit = Math.ceil(limit / 2);
    const serviceLimit = Math.floor(limit / 2);

    // Run searches in parallel
    const [products, services] = await Promise.all([
      searchProducts(queryText, productLimit),
      searchServices(queryText, serviceLimit),
    ]);

    // Add a type field to differentiate between products and services
    const productsWithType = products.map(product => ({
      ...product,
      itemType: 'product'
    }));
    
    const servicesWithType = services.map(service => ({
      ...service,
      itemType: 'service'
    }));

    // Combine all results
    const combinedResults = [...productsWithType, ...servicesWithType];
    
    // Sort by similarity score (higher scores are better)
    const sortedResults = combinedResults.sort((a, b) => {
      return (b.score || 0) - (a.score || 0);
    });

    // Limit to the requested number of results
    const limitedResults = sortedResults.slice(0, limit);

    // Return both combined results and separate arrays for backward compatibility
    return {
      combined: limitedResults,
      products,
      services,
    };
  } catch (error) {
    console.error("Error in combined search:", error);
    throw error;
  }
}

// Quick search for autocomplete/suggestions
async function quickSearch(queryText, limit = 5) {
  try {
    // For quick search, we'll use text search as it's faster
    const query = {
      $or: [
        { title: { $regex: `^${queryText}`, $options: "i" } }, // Starts with the query
        { category: { $regex: `^${queryText}`, $options: "i" } }, // Category starts with query
      ],
      status: "Approved",
      isActive: true,
    };

    // Get products and services in parallel
    const [products, services] = await Promise.all([
      ProductListing.find(query).select("title category").limit(limit),
      ServiceListing.find(query).select("title category").limit(limit),
    ]);

    // Extract unique titles and categories for suggestions
    const suggestions = new Set();

    [...products, ...services].forEach((item) => {
      if (item.title) suggestions.add(item.title);
      if (item.category) suggestions.add(item.category);
    });

    return Array.from(suggestions).slice(0, limit);
  } catch (error) {
    console.error("Error in quick search:", error);
    return [];
  }
}

module.exports = {
  searchProducts,
  searchServices,
  combinedSearch,
  quickSearch,
};
