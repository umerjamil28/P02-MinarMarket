const ProductListing = require("../models/ProductListing"); // Import the ProductListing model
const mongoose = require("mongoose");
const { addEmbeddingToDocument } = require("../utils/embeddingService");
const User = require("../models/User"); 

// Controller to handle adding a new product listing
exports.addProductListing = async (req, res) => {
  try {
    const { title, description, price, category, images, userId } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required, and at least one image must be provided.",
      });
    }

    // Check that no more than 6 images are being uploaded
    if (images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }

    // Create a new product listing (with embedding if middleware added it)
    const productData = {
      title,
      description,
      price,
      category,
      images,
      listerId: userId,
    };

    // If embedding middleware was successful, it will be in req.body
    if (req.body.embedding) {
      productData.embedding = req.body.embedding;
    } else {
      // If middleware failed, try to generate embedding here as fallback
      try {
        const docWithEmbedding = await addEmbeddingToDocument(productData);
        if (docWithEmbedding.embedding) {
          productData.embedding = docWithEmbedding.embedding;
        }
      } catch (embeddingError) {
        console.error("Fallback embedding generation failed:", embeddingError);
        // Continue without embedding if generation fails
      }
    }

    // Create new product with the data including embedding if available
    const newProduct = new ProductListing(productData);

    // Save to the database
    await newProduct.save();

    // Send a success response
    return res.status(201).json({
      success: true,
      message: "Product listing added successfully.",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product listing:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the product listing.",
    });
  }
};

exports.showProductListings = async (req, res) => {
  try {
    const userId = req.query.userId?.toString();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const productListings = await ProductListing.find({
      status: "Approved",
      isActive: true,
      listerId: { $ne: userId },
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Product listings retrieved successfully.",
      data: productListings,
    });
  } catch (error) {
    console.error("Error retrieving product listings:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving product listings.",
    });
  }
};

// Controller to show product listings for a specific lister
exports.showMyProductListings = async (req, res) => {
  try {
    // Extract the id from the request body
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Lister ID is required.",
      });
    }

    // Convert the id to a MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    // Query the database for listings with the given listerId
    const productListings = await ProductListing.find({
      isActive: true,
      listerId: objectId,
    });

    return res.status(200).json({
      success: true,
      message: "Product listings retrieved successfully.",
      data: productListings,
    });
  } catch (error) {
    console.error("Error retrieving my product listings:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving my product listings.",
    });
  }
};

// Controller to fetch details of a specific product listing
// 3.2.29 use case is completed here
exports.fetchProductListing = async (req, res) => {
  try {
    // Extract the productId from the request parameters
    const { productId } = req.params;

    // Validate the productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    // Fetch the product details with only the required fields
    const product = await ProductListing.findById(
      productId,
      "_id title description price category images"
    );

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Return the product details
    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      product,
    });
  } catch (error) {
    console.error("Error fetching the product details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product details.",
    });
  }
};

// Controller to update a product listing
exports.updateProductListing = async (req, res) => {
  try {
    // Extract the product ID from the route parameters
    const { productId } = req.params;

    // Convert productId to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    const { title, description, price, category, images } = req.body; // Extract fields from the request body

    // Validate required fields
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !images ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required, and at least one image must be provided.",
      });
    }

    // Check that no more than 6 images are being uploaded
    if (images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      price,
      category,
      images,
      status: "Pending",
    };

    // If embedding middleware was successful, add it to the update
    if (req.body.embedding) {
      updateData.embedding = req.body.embedding;
    } else {
      // If middleware failed, try to generate embedding here as fallback
      try {
        const docWithEmbedding = await addEmbeddingToDocument({
          title,
          description,
          category,
        });
        if (docWithEmbedding.embedding) {
          updateData.embedding = docWithEmbedding.embedding;
        }
      } catch (embeddingError) {
        console.error("Fallback embedding generation failed:", embeddingError);
        // Continue without updating embedding if generation fails
      }
    }

    // Find the product by ID and update its details
    const updatedProduct = await ProductListing.findByIdAndUpdate(
      objectId,
      updateData,
      { new: true } // Return the updated document
    );

    // If no product is found, return an error
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Send a success response
    return res.status(200).json({
      success: true,
      message: "Product details updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating the product details:", error);

    // Handle invalid ObjectId errors explicitly
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the product details.",
    });
  }
};

exports.showProductCategoryListings = async (req, res) => {
  try {
    const { category } = req.params;
    const { userId } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category must be Provided.",
      });
    }

    // Find approved and active product listings of the category specified excluding user's own listings
    const productListings = await ProductListing.find({
      status: "Approved",
      isActive: true,
      listerId: { $ne: userId }, // Exclude products listed by the user
      category: category,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    });

    return res.status(200).json({
      success: true,
      message:
        "Product listings of the specified category retrieved successfully.",
      data: productListings,
    });
  } catch (error) {
    console.error(
      "Error retrieving product listings of the specified category:",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving product listings of the category specified.",
    });
  }
};

exports.fetchLandingPageProducts = async (req, res) => {
  try {
    const productListings = await ProductListing.find({
      status: "Approved",
      isActive: true,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    });

    return res.status(200).json({
      success: true,
      data: productListings,
    });
  } catch (error) {
    console.error("Error retrieving product listings for landing page:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving product listings for landing page.",
    });
  }
};

exports.fetchCategoryLandingPage = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category must be Provided.",
      });
    }

    const productListings = await ProductListing.find({
      status: "Approved",
      isActive: true,
      category: category,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    });

    return res.status(200).json({
      success: true,
      data: productListings,
    });
  } catch (error) {
    console.error(
      "Error retrieving product listings of the speicfied category",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving product listing for specified category on the landing page.",
    });
  }
};






exports.getRecommendedProducts = async (req, res) => {
  try {
    const { userId } = req.body;
 // Assuming userId is passed as a parameter

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Fetch the user document based on userId
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get the recommended product IDs from the user document
    const recommendedProductIds = user.recommendedProducts; // Assuming recommendedProducts is an array of product IDs

    // Check if there are recommended products
    if (!recommendedProductIds || recommendedProductIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recommended products found for this user.",
      });
    }

    // Fetch the product listings based on the recommended product IDs
    const recommendedProducts = await ProductListing.find({
      _id: { $in: recommendedProductIds },
      isActive: true, // Ensure the product is active
      status: "Approved", // Ensure the product is approved
    });

    // Return the recommended products to the frontend
    return res.status(200).json({
      success: true,
      message: "Recommended products fetched successfully.",
      data: recommendedProducts,
    });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching recommended products.",
    });
  }
};





const fs = require("fs");
const axios = require("axios");
const { spawn } = require("child_process");
const tmp = require("tmp");
const ProductEmbedding = require("../models/productEmbedding");
// Utility: cosine similarity
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

exports.getEmbedding = async (req, res) => {
  const { imageUrl } = req.body;
  

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL not provided." });
  }

  try {
    // Fetch the image from Cloudinary URL
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    // Create a temporary file to store the downloaded image
    const tempFile = tmp.fileSync({ postfix: ".jpg" });
    fs.writeFileSync(tempFile.name, response.data);

    // Run Python script to get the image embedding
    const python = spawn("python3", ["getEmbeddingFromLocal.py", tempFile.name]);

    let output = "";
    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });

    python.on("close", async () => {
      fs.unlinkSync(tempFile.name); // Clean up temporary file

      let uploadedEmbedding;
      try {
        uploadedEmbedding = JSON.parse(output);
      } catch (err) {
        return res.status(500).json({ error: "Embedding parse error." });
      }

      try {
        const allEmbeddings = await ProductEmbedding.find({});
        const matches = [];
       
        
        for (let record of allEmbeddings) {
          const similarity = cosineSimilarity(uploadedEmbedding, record.embedding);
          if (similarity > 0.2) {
            const product = await ProductListing.findById(record.productId);
            if (product?.isActive && product.status === "Approved") {
              if (!matches.some(match => match.product._id.toString() === product._id.toString())) {
                matches.push({ product, similarity });
            }
            }
          }
        }

        matches.sort((a, b) => b.similarity - a.similarity);
        console.log(matches)
        return res.json({ matches });
      } catch (dbErr) {
        console.error("Database error:", dbErr);
        return res.status(500).json({ error: "Database error." });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error." });
  }
};

