const { initializeVectorSearchIndexes } = require('../utils/vectorSearch');

async function main() {
  console.log('Initializing vector search indexes...');
  const result = await initializeVectorSearchIndexes();
  
  if (result.success) {
    console.log('Vector search indexes initialized successfully');
  } else {
    console.error('Failed to initialize vector search indexes:', result.error);
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
