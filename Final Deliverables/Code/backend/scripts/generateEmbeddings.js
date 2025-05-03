const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
// Remove Mongoose model imports
// const ProductListing = require('../models/ProductListing');
// const ServiceListing = require('../models/ServiceListing');
const { addEmbeddingToDocument } = require('../utils/embeddingService');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// MongoDB Connection URL and Database Name
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME || 'MinarMarket'; // Add your DB name to .env or set a default
let client; // Declare client variable

// Function to process products
async function processProducts(db) { // Accept db object
  console.log('Starting to process product listings...');
  const productsCollection = db.collection('productlistings'); // Get collection

  try {
    // Get all products where the embedding field is null or does not exist
    const products = await productsCollection.find({ embedding: { $exists: false } }).toArray(); // Use collection.find().toArray()

    console.log(`Found ${products.length} products that need embeddings`);

    let success = 0;
    let failed = 0;

    // Process each product
    for (const product of products) {
      try {
        if (product.title && product.description) {
          const docWithEmbedding = await addEmbeddingToDocument({
            title: product.title,
            description: product.description,
            category: product.category || ''
          });

          if (docWithEmbedding && docWithEmbedding.embedding) {
            // Update the product with the new embedding using updateOne
            await productsCollection.updateOne(
              { _id: product._id },
              { $set: { embedding: docWithEmbedding.embedding } }
            );
            success++;
            console.log(`Updated embedding for product: ${product._id} - ${product.title}`);
          } else {
            failed++;
            console.error(`Failed to generate embedding for product: ${product._id}`);
          }
        } else {
          failed++;
          console.error(`Product ${product._id} is missing title or description`);
        }
      } catch (error) {
        failed++;
        console.error(`Error processing product ${product._id}:`, error);
      }

      // Add a small delay to avoid overwhelming the embedding service
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Processed products - Success: ${success}, Failed: ${failed}`);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Function to process services
async function processServices(db) { // Accept db object
  console.log('Starting to process service listings...');
  const servicesCollection = db.collection('servicelistings'); // Get collection

  try {
    // Get all services where embedding is null or does not exist
    const services = await servicesCollection.find({ embedding: { $exists: false } }).toArray(); // Use collection.find().toArray()


    console.log(`Found ${services.length} services that need embeddings`);

    let success = 0;
    let failed = 0;

    // Process each service
    for (const service of services) {
      try {
        if (service.title && service.description) {
          const docWithEmbedding = await addEmbeddingToDocument({
            title: service.title,
            description: service.description,
            category: service.category || ''
          });

          if (docWithEmbedding && docWithEmbedding.embedding) {
            // Update the service with the new embedding using updateOne
            await servicesCollection.updateOne(
              { _id: service._id },
              { $set: { embedding: docWithEmbedding.embedding } }
            );
            success++;
            console.log(`Updated embedding for service: ${service._id} - ${service.title}`);
          } else {
            failed++;
            console.error(`Failed to generate embedding for service: ${service._id}`);
          }
        } else {
          failed++;
          console.error(`Service ${service._id} is missing title or description`);
        }
      } catch (error) {
        failed++;
        console.error(`Error processing service ${service._id}:`, error);
      }

      // Add a small delay to avoid overwhelming the embedding service
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Processed services - Success: ${success}, Failed: ${failed}`);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
}

// Main function
async function main() {
  console.log('Starting embedding generation script');

  try {
    // Connect using MongoClient
    client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName); // Get database object

    // Process products and services, passing the db object
    await processProducts(db);
    await processServices(db);

    console.log('Embedding generation completed');
  } catch (error) {
    console.error('Error in embedding generation script:', error);
    process.exit(1); // Exit if connection or main processing fails
  } finally {
    // Close the client connection
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

// Run the script
main();