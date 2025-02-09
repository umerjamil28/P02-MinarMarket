const ProductListing = require("../models/ProductListing"); // Import the ProductListing model
const ServiceListing = require("../models/ServiceListing");

// Controller to handle fetching product listings by user ID
exports.getSellerProductListings = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch seller listings.",
      });
    }

    // Fetch products with listerId matching userId
    const products = await ProductListing.find({
      listerId: userId,
      isActive: 1,
    });

    // Check if products were found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No listings found for this user.",
      });
    }

    // Send a success response with the products
    return res.status(200).json({
      success: true,
      message: "Seller Product listings fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching seller product listings:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching seller product listings.",
    });
  }
};

exports.getSellerServicesListings = async (req, res) => {
  try {
    // console.log("Request params:", req.params);

    const { userId } = req.params;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required to fetch seller's services listings.",
      });
    }

    // Fetch services with listerId matching userId
    const services = await ServiceListing.find({
      listerId: userId,
      isActive: 1,
    });

    // Check if services were found
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services listings found for this user.",
      });
    }

    // Send a success response with the services
    return res.status(200).json({
      success: true,
      message: "Seller Services listings fetched successfully.",
      data: services,
    });
  } catch (error) {
    console.error("Error fetching seller services listings:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching seller services listings.",
    });
  }
};

// Controller to handle deletion of listings by item IDs
exports.deactivateListings = async (req, res) => {
  // console.log("IDR HU");
  const { listingIds, type } = req.body; // Expecting an array of listingIds
  try {
    let result;
    if (type == "product") {
      // Update the isActive status of all products in the listingIds array
      const result = await ProductListing.updateMany(
        { _id: { $in: listingIds } },
        { $set: { isActive: false } }
      );

      // If no listings were updated, send a 404 response
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No listings were deactivated.",
        });
      }
    } else {
      const result = await ServiceListing.updateMany(
        { _id: { $in: listingIds } },
        { $set: { isActive: false } }
      );

      // If no listings were updated, send a 404 response
      if (result.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No listings were deactivated.",
        });
      }
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Listings deactivated successfully.",
    });
  } catch (error) {
    console.error("Error deactivating listings:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deactivating listings.",
    });
  }
};
