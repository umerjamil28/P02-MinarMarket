const ProductListing = require("../models/ProductListing");
const ServiceListing = require("../models/ServiceListing");
const User = require("../models/User");



const updateSellerRating = async (sellerId) => {
    try {
      // Fetch all product listings by this seller
      const productListings = await ProductListing.find({ listerId: sellerId });
      
      // Compute average product rating
      let totalProductRating = 0;
      let numProductRatings = 0;
  
      productListings.forEach(product => {
        product.product_rating.forEach(rating => {
          totalProductRating += rating.rating;
          numProductRatings++;
        });
      });
  
      const avgProductRating = numProductRatings > 0 ? (totalProductRating / numProductRatings) : null;
  
      // Fetch all service listings by this seller
      const serviceListings = await ServiceListing.find({ listerId: sellerId });
  
      // Compute average service rating
      let totalServiceRating = 0;
      let numServiceRatings = 0;
  
      serviceListings.forEach(service => {
        service.service_rating.forEach(rating => {
          totalServiceRating += rating.rating;
          numServiceRatings++;
        });
      });
  
      const avgServiceRating = numServiceRatings > 0 ? (totalServiceRating / numServiceRatings) : null;
  
      // Compute weighted seller rating
      let weightedSellerRating;
      if (avgProductRating !== null && avgServiceRating !== null) {
        weightedSellerRating = 0.5 * avgProductRating + 0.5 * avgServiceRating;
      } else if (avgProductRating !== null) {
        weightedSellerRating = avgProductRating;
      } else if (avgServiceRating !== null) {
        weightedSellerRating = avgServiceRating;
      } else {
        weightedSellerRating = null; // No ratings at all
      }
  
      // Update the seller's rating in the User model
      if (weightedSellerRating !== null) {
        await User.findByIdAndUpdate(sellerId, { seller_rating: weightedSellerRating });
      }
  
    } catch (error) {
      console.error("Error updating seller rating:", error);
    }
};

  

exports.addProductRating = async (req, res) => {
  try {
    const { listingId, buyerId, rating, review } = req.body;

    // Validate required fields
    if (!listingId || !buyerId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, Buyer ID, Rating, and Review are required.",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Fetch the product listing
    const product = await ProductListing.findById(listingId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    // Check if the buyer has already rated this product
    const existingRating = product.product_rating.find(r => r.buyerId.toString() === buyerId);

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this product.",
      });
    }

    // Add new rating & review to product_rating array
    product.product_rating.push({ buyerId, rating, review });

    // Save the updated product listing
    await product.save();

    // Extract seller (listerId)
    const sellerId = product.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Rating and review added successfully.",
      data: product.product_rating,
    });

  } catch (error) {
    console.error("Error adding product rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the rating.",
    });
  }
};


exports.addServiceRating = async (req, res) => {
  try {
    const { listingId, buyerId, rating, review } = req.body;

    // Validate required fields
    if (!listingId || !buyerId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, Buyer ID, Rating, and Review are required.",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Fetch the service listing
    const service = await ServiceListing.findById(listingId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service listing not found.",
      });
    }

    // Check if the buyer has already rated this service
    const existingRating = service.service_rating.find(r => r.buyerId.toString() === buyerId);

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this service.",
      });
    }

    // Add new rating & review to service_rating array
    service.service_rating.push({ buyerId, rating, review });

    // Save the updated service listing
    await service.save();

    // Extract seller (listerId)
    const sellerId = service.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Rating and review added successfully.",
      data: service.service_rating,
    });

  } catch (error) {
    console.error("Error adding service rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the rating.",
    });
  }
};

exports.updateProductRating = async (req, res) => {
  try {
    const { listingId, buyerId, rating, review } = req.body;

    // Validate required fields
    if (!listingId || !buyerId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, Buyer ID, Rating, and Review are required.",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Fetch the product listing
    const product = await ProductListing.findById(listingId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    // Find the existing rating by buyerId
    const existingRatingIndex = product.product_rating.findIndex(r => r.buyerId.toString() === buyerId);

    if (existingRatingIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You haven't rated this product yet.",
      });
    }

    // Update the existing rating and review
    product.product_rating[existingRatingIndex].rating = rating;
    product.product_rating[existingRatingIndex].review = review;

    // Save the updated product listing
    await product.save();

    // Extract seller (listerId)
    const sellerId = product.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Product rating updated successfully.",
      data: product.product_rating,
    });

  } catch (error) {
    console.error("Error updating product rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the rating.",
    });
  }
};


exports.updateServiceRating = async (req, res) => {
  try {
    const { listingId, buyerId, rating, review } = req.body;

    // Validate required fields
    if (!listingId || !buyerId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, Buyer ID, Rating, and Review are required.",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Fetch the service listing
    const service = await ServiceListing.findById(listingId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service listing not found.",
      });
    }

    // Find the existing rating by buyerId
    const existingRatingIndex = service.service_rating.findIndex(r => r.buyerId.toString() === buyerId);

    if (existingRatingIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You haven't rated this service yet.",
      });
    }

    // Update the existing rating and review
    service.service_rating[existingRatingIndex].rating = rating;
    service.service_rating[existingRatingIndex].review = review;

    // Save the updated service listing
    await service.save();

    // Extract seller (listerId)
    const sellerId = service.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Service rating updated successfully.",
      data: service.service_rating,
    });

  } catch (error) {
    console.error("Error updating service rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the rating.",
    });
  }
};


exports.deleteProductRating = async (req, res) => {
  try {
    const { listingId, buyerId } = req.body;

    // Validate required fields
    if (!listingId || !buyerId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID and Buyer ID are required.",
      });
    }

    // Fetch the product listing
    const product = await ProductListing.findById(listingId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product listing not found.",
      });
    }

    // Find the index of the rating given by this buyer
    const ratingIndex = product.product_rating.findIndex(r => r.buyerId.toString() === buyerId);

    if (ratingIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Rating not found for this buyer.",
      });
    }

    // Remove the rating from the array
    product.product_rating.splice(ratingIndex, 1);

    // Save the updated product listing
    await product.save();

    // Extract seller (listerId)
    const sellerId = product.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Product rating deleted successfully.",
      data: product.product_rating,
    });

  } catch (error) {
    console.error("Error deleting product rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the rating.",
    });
  }
};


exports.deleteServiceRating = async (req, res) => {
  try {
    const { listingId, buyerId } = req.body;

    // Validate required fields
    if (!listingId || !buyerId) {
      return res.status(400).json({
        success: false,
        message: "Listing ID and Buyer ID are required.",
      });
    }

    // Fetch the service listing
    const service = await ServiceListing.findById(listingId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service listing not found.",
      });
    }

    // Find the index of the rating given by this buyer
    const ratingIndex = service.service_rating.findIndex(r => r.buyerId.toString() === buyerId);

    if (ratingIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Rating not found for this buyer.",
      });
    }

    // Remove the rating from the array
    service.service_rating.splice(ratingIndex, 1);

    // Save the updated service listing
    await service.save();

    // Extract seller (listerId)
    const sellerId = service.listerId;

    // Compute seller's new weighted average rating
    await updateSellerRating(sellerId);

    return res.status(200).json({
      success: true,
      message: "Service rating deleted successfully.",
      data: service.service_rating,
    });

  } catch (error) {
    console.error("Error deleting service rating:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the rating.",
    });
  }
};
