const { addEmbeddingToDocument } = require('../utils/embeddingService');

// Middleware to add embeddings to product and service documents
exports.addEmbedding = async (req, res, next) => {
  try {
    // Only process if there's a body with title and description
    if (req.body && req.body.title && req.body.description) {
      // Add embedding to the document
      const docWithEmbedding = await addEmbeddingToDocument(req.body);
      req.body = docWithEmbedding;
    }
    next();
  } catch (error) {
    console.error('Error in embedding middleware:', error);
    // Continue even if embedding fails
    next();
  }
};
