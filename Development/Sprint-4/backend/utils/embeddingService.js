import { pipeline } from '@xenova/transformers';
import { config } from 'dotenv';

config();

// Cache the pipeline instance
let extractor = null;

async function createEmbedding(text) {
  try {
    console.log('Creating embedding for text:', text.substring(0, 50) + '...');
    
    // Initialize the pipeline only once
    if (!extractor) {
      console.log('Initializing feature extraction pipeline...');
      // Use a lightweight model suitable for CPU inference
      extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('Feature extraction pipeline loaded successfully.');
    }

    // Generate embedding
    const output = await extractor(text, { pooling: 'mean', normalize: true });

    // The output contains the embedding vector in output.data
    // Convert Float32Array to a regular array if necessary for storage/compatibility
    console.log('Embedding created successfully. Dimensions:', output.data.length);
    return Array.from(output.data);
    
  } catch (error) {
    console.error('Error creating embedding locally:', error.message);
    console.error('Error stack:', error.stack);
    // Return null so the application can fall back to text search
    return null;
  }
}

// Add embeddings to a product or service document
async function addEmbeddingToDocument(doc) {
  try {
    if (!doc.title || !doc.description) {
      throw new Error('Document must have title and description');
    }

    const textToEmbed = `${doc.title} ${doc.description} ${doc.category || ''}`;
    const embedding = await createEmbedding(textToEmbed);
    
    if (!embedding) {
      throw new Error('Failed to create embedding');
    }
    
    return {
      ...doc,
      embedding
    };
  } catch (error) {
    console.error('Error adding embedding to document:', error);
    throw error;
  }
}

export default {
  createEmbedding,
  addEmbeddingToDocument
};
