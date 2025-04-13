const ServiceListing = require("../models/ServiceListing");
const mongoose = require("mongoose");
const User = require("../models/User");
const { addEmbeddingToDocument } = require("../utils/embeddingService");

exports.showMyServiceListings = async (req, res) => {
  try {
    const userId = req.query.listerId;
    
    // Validate userId is present and valid
    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Valid Lister ID is required.",
      });
    }

    // Verify this is a valid ObjectId before trying to convert
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lister ID format.",
      });
    }

    const serviceListings = await ServiceListing.find({
      listerId: new mongoose.Types.ObjectId(userId),
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

    // Create service data object
    const serviceData = {
      title,
      description,
      rate,
      pricingModel,
      city,
      category,
      images,
      listerId: userId,
    };

    // If embedding middleware was successful, it will be in req.body
    if (req.body.embedding) {
      serviceData.embedding = req.body.embedding;
    } else {
      // If middleware failed, try to generate embedding here as fallback
      try {
        const docWithEmbedding = await addEmbeddingToDocument({
          title,
          description,
          category
        });
        if (docWithEmbedding.embedding) {
          serviceData.embedding = docWithEmbedding.embedding;
        }
      } catch (embeddingError) {
        console.error("Fallback embedding generation failed:", embeddingError);
        // Continue without embedding if generation fails
      }
    }

    const newService = new ServiceListing(serviceData);
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

    const { title, description, rate, pricingModel, city, category, images } =
      req.body;

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
        message:
          "All fields are required, and at least one image must be provided.",
      });
    }

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
      rate,
      pricingModel,
      city,
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

    const updatedService = await ServiceListing.findByIdAndUpdate(
      objectId,
      updateData,
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
    const userId = req.query.userId?.toString();

    // Build the query filter
    const filter = {
      status: "Approved",
      isActive: true,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    };

    // Only add the listerId exclusion if userId is valid
    if (userId && userId !== "null" && userId !== "undefined" && mongoose.Types.ObjectId.isValid(userId)) {
      filter.listerId = { $ne: new mongoose.Types.ObjectId(userId) };
    }

    const serviceListings = await ServiceListing.find(filter);

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

exports.fetchServiceCategoryListings = async (req, res) => {
  try {
    const { userId } = req.body;
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is missing from the parameters",
      });
    }

    // Build the filter
    const filter = {
      status: "Approved",
      isActive: true,
      category: category,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    };

    // Only add the listerId exclusion if userId is valid
    if (userId && userId !== "null" && userId !== "undefined" && mongoose.Types.ObjectId.isValid(userId)) {
      filter.listerId = { $ne: new mongoose.Types.ObjectId(userId) };
    }

    const serviceListings = await ServiceListing.find(filter);

    return res.status(200).json({
      success: true,
      data: serviceListings,
    });
  } catch (error) {
    console.error(
      "Error retrieving service listings from specified category: ",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving service listings from specified category.",
    });
  }
};

exports.fetchLandingPageServices = async (req, res) => {
  try {
    const serviceListings = await ServiceListing.find({
      status: "Approved",
      isActive: true,
      $or: [
        { listerAccountStatus: "Active" }, // Include explicitly "Active"
        { listerAccountStatus: { $exists: false } }, // Include documents where listerAccountStatus is missing
      ],
    });

    res.status(200).json({
      success: true,
      data: serviceListings,
    });
  } catch (error) {
    console.error(
      "Error retrieving service listings for landing page: ",
      error
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving service listings for landing page.",
    });
  }
};

exports.fetchCategoryLandingPage = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is missing from the parameters",
      });
    }

    const serviceListings = await ServiceListing.find({
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
      data: serviceListings,
    });
  } catch (error) {
    console.error(
      "Error while retrieving services for specified category on the landing page"
    );
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while retrieving services for specified category on the landing page",
    });
  }
};
