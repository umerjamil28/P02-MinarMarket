const ServiceListing = require("../models/ServiceListing");
const mongoose = require("mongoose");

exports.showMyServiceListings = async (req, res) => {
  try{
    const userId = req.query.listerId;
    console.log(userId);
    const serviceListings = await ServiceListing.find({
      listerId: userId,

    });

    console.log(serviceListings);
    return res.status(200).json({
      success: true,
      message: "Service Listings retrieved successfully.",
      data: serviceListings,
    });
  }
  catch (error) {
    console.error("Error retrieving service listings: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving service listings.",
    });
  }

};

exports.addServiceListing = async (req, res) => {
  try {
    const {
      title,
      description,
      rate,
      userId,
      images,
      pricingModel,
      city,
      category,
    } = req.body;

    if (
      !title ||
      !description ||
      !rate ||
      !userId ||
      !pricingModel ||
      !city ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check that no more than 6 images are being uploaded
    if (images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }
    const newService = new ServiceListing({
      title,
      description,
      rate,
      pricingModel,
      city,
      category,
      images,
      listerId: userId,
    });

    await newService.save();

    return res.status(201).json({
      success: true,
      message: "Service Listing added successfully.",
      data: newService,
    });
  } catch (error) {
    console.error("Error adding Service Listing", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the service listing",
    });
  }
};

exports.fetchServiceListing = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Validate the serviceId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format.",
      });
    }

    const service = await ServiceListing.findById(
      serviceId,
      "_id title description category rate pricingModel city images"
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service details fetched successfully.",
      service,
    });
  } catch (error) {
    console.error("Error fetching Service Listing", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the service listing",
    });
  }
};

exports.updateServiceListing = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Convert serviceId to ObjectId
    const objectId = new mongoose.Types.ObjectId(serviceId);

    const {
      title,
      description,
      rate,
      pricingModel,
      city,
      category,
      images,
    } = req.body;

    if (
      !title ||
      !description ||
      !rate ||
      !category ||
      !pricingModel ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and at least one image must be provided.",
      });
    }

    if (images.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 6 images.",
      });
    }

    const updatedService = await ServiceListing.findByIdAndUpdate(
      objectId,
      {
        title,
        description,
        rate,
        pricingModel,
        city,
        category,
        images,
        status: "Pending",
      },
      { new: true } // Return the updated document
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service details updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating Service Listing", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the service listing",
    });
  }
};

// Controller to show all approved service listings
exports.showServiceListings = async (req, res) => {
  try {
    const serviceListings = await ServiceListing.find({
      status: "Approved",
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      message: "Service Listings retrieved successfully.",
      data: serviceListings,
    });
  } catch (error) {
    console.error("Error retrieving service listings: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving service listings.",
    });
  }
};
