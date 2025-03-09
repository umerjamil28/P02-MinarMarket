const express = require("express");
const BuyerRequirement = require("../models/BuyerRequirement");

// Controller function to handle product listing
exports.listProduct = async (req, res) => {
  try {
    const { title, description, price, category, userId, images } = req.body;

    // Validate required fields
    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and category are required fields.",
      });
    }

    // Check that no more than 6 images are being uploaded
    if (images && images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }

    // Create a new product entry
    const newProduct = new BuyerRequirement({
      title,
      description,
      price,
      category,
      images: images || [],
      listerId: userId,
    });

    await newProduct.save();

    console.log("New Product Requirement: ", newProduct);

    return res.status(201).json({
      success: true,
      message: "Product requirement added successfully.",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product requirement:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the product requirement.",
    });
  }
};

exports.myListings = async (req, res) => {
  const buyerId = req.headers.buyerid;

  if (!buyerId) {
    return res
      .status(400)
      .json({ success: false, message: "buyerId is required" });
  }

  try {
    const listings = await BuyerRequirement.find({ listerId: buyerId });

    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteListings = async (req, res) => {
  const { buyerId, productId } = req.body;

  // Validate required fields
  if (!buyerId || !productId) {
    return res.status(400).json({
      success: false,
      message: "Buyer ID and Product ID are required.",
    });
  }

  try {
    // Find and delete the listing
    const result = await BuyerRequirement.deleteOne({
      _id: productId, // Match the product ID
      listerId: buyerId, // Ensure the listing belongs to the buyer
    });

    // Check if the deletion was successful
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or does not belong to the buyer.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the listing.",
    });
  }
};

exports.updateListings = async (req, res) => {
  try {
    const { buyerId, productId, updatedData } = req.body;

    // Validate required fields
    if (!buyerId || !productId || !updatedData) {
      return res.status(400).json({
        success: false,
        message: "Buyer ID, Product ID, and updated data are required.",
      });
    }

    // Check that no more than 6 images are being uploaded
    if (updatedData.images && updatedData.images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }

    // Find the listing and update it
    const listing = await BuyerRequirement.findOne({
      _id: productId,
      listerId: buyerId,
    });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or does not belong to the buyer.",
      });
    }

    // Update the fields
    Object.assign(listing, updatedData, { status: "Pending" });
    await listing.save();
    console.log(updatedData);

    res.status(200).json({
      success: true,
      message: "Listing updated successfully. Awaiting approval.",
      data: listing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the listing.",
    });
  }
};

exports.fetchProductRequirementDetails = async (req, res) => {
  try {
    const { productRequirementId } = req.params;

    // Fetch the requirement from MongoDB
    const requirement = await BuyerRequirement.findById(productRequirementId);

    // Check if requirement exists
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: "Product requirement not found.",
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    console.error(
      "Error fetching the details of the productRequirement:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching the details of the productRequirement.",
    });
  }
};
