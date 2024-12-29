const express = require("express");
const BuyerRequirement = require("../models/BuyerRequirement");


// Controller function to handle product listing
exports.listProduct = async (req, res) => {
  
 
  try {
    console.log("Controller wala API: ", process.env.REACT_APP_API_URL+"/api/buyer-requirement")

    const { title, description, price, category, userId } = req.body;

    // Validate required fields
    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required, and at least one image must be provided.',
    });
    }

    // Create a new product entry
    const newProduct = new BuyerRequirement({
      title,
      description,
      price,
      category,
      listerId: userId, 
    });

    await newProduct.save();

    console.log("New Product: ", newProduct);

    return res.status(201).json({
      success: true,
      message: 'Product listing added successfully.',
      data: newProduct,
      });
    } catch (error) {
    console.error('Error adding product listing:', error);
    return res.status(500).json({
        success: false,
        message: 'An error occurred while adding the product listing.',
    });
}

};

exports.myListings = async (req, res) => {
  const buyerId = req.headers.buyerid;
 
  if (!buyerId) {
    return res.status(400).json({ success: false, message: "buyerId is required" });
  }

  try {
    const listings = await BuyerRequirement.find({ listerId: buyerId });
    
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}



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
}


exports.updateListings = async (req, res) => {
  try {
      const { buyerId, productId, updatedData } = req.body;

      // Validate required fields
      if (!buyerId || !productId || !updatedData) {
          return res.status(400).json({
              success: false,
              message: "Buyer ID, Product ID, and updated data are required."
          });
      }

      // Find the listing and update it
      const listing = await BuyerRequirement.findOne({ _id: productId, listerId: buyerId });
    

      if (!listing) {
          return res.status(404).json({
              success: false,
              message: "Listing not found or does not belong to the buyer."
          });
      }

      // Update the fields
      Object.assign(listing, updatedData, { status: "Pending" });
      await listing.save();
      console.log(updatedData)

      res.status(200).json({
          success: true,
          message: "Listing updated successfully. Awaiting approval.",
          data: listing
      });
  } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred while updating the listing."
      });
  }
};

