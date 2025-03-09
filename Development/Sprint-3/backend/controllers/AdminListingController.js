const ProductListing = require('../models/ProductListing');
const user = require('../models/User');
const ServiceListing = require("../models/ServiceListing");
const ProductRequirementListing = require("../models/BuyerRequirement");
const ServiceRequirementListing = require("../models/BuyerServiceRequirement")
exports.getAllProductListings = async (req, res) => {
    
    
    try {
        // Find all active product listings and populate the lister's name from the User collection
        const products = await ProductListing.find({ isActive: 1 })
            .populate({
                path: 'listerId',
                model: 'user', 
                select: 'name' // Only select the name field from the User model
            });

        // Check if products were found
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No product listings found in the database.',
            });
        }

        // Send a success response with the products and the seller's name
        return res.status(200).json({
            success: true,
            message: 'Product listings fetched successfully.',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching all product listings:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching product listings.',
        });
    }
};



exports.getAllServiceListings = async (req, res) => {
    
    try {
        // Find all active service listings and populate the lister's name from the User collection
        const services = await ServiceListing.find({ isActive: 1 })
            .populate({
                path: 'listerId',
                model: 'user', 
                select: 'name' // Only select the name field from the User model
            });

        // Check if services were found
        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No service listings found in the database.',
            });
        }

        // Send a success response with the services and the seller's name
        return res.status(200).json({
            success: true,
            message: 'Service listings fetched successfully.',
            data: services,
        });
    } catch (error) {
        console.error('Error fetching all service listings:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching service listings.',
        });
    }
};



exports.getAllProductsRequirementListings = async (req, res) => {
    
    try {
        // Find all active products requirement listings and populate the lister's name from the User collection
        const productsRequirement = await ProductRequirementListing.find({ isActive: 1 })
            .populate({
                path: 'listerId',
                model: 'user', 
                select: 'name' // Only select the name field from the User model
            });

        // Check if products were found
        if (productsRequirement.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No product requirement listings found in the database.',
            });
        }

        // Send a success response with the products and the seller's name
        return res.status(200).json({
            success: true,
            message: 'Products Requirement listings fetched successfully.',
            data: productsRequirement,
        });
    } catch (error) {
        console.error('Error fetching all products requirement listings:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching products requirement listings.',
        });
    }
};



exports.getAllServicesRequirementListings = async (req, res) => {
    
    try {
        // Find all active services requirement listings and populate the lister's name from the User collection
        const servicesRequirement = await ServiceRequirementListing.find({ isActive: 1 })
            .populate({
                path: 'listerId',
                model: 'user', 
                select: 'name' // Only select the name field from the User model
            });

        // Check if services were found
        if (servicesRequirement.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No services requirement listings found in the database.',
            });
        }

        // Send a success response with the services and the seller's name
        return res.status(200).json({
            success: true,
            message: 'Services Requirement listings fetched successfully.',
            data: servicesRequirement,
        });
    } catch (error) {
        console.error('Error fetching all services requirement listings:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching services requirement listings.',
        });
    }
};




exports.getUpdateProductListings = async (req, res) => {
    const { itemIds, newStatus } = req.body;
    // console.log(newStatus)
    // Check if itemIds and newStatus are provided
    if (!itemIds || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Please provide both itemIds and newStatus in the request body.",
        });
    }

    try {
        // Update the status of all listings with matching itemIds
        const updateResult = await ProductListing.updateMany(
            { _id: { $in: itemIds } }, // Match listings by itemIds
            { status: newStatus }      // Set the new status
        );

        // Check if any listings were updated
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No listings were updated. Please check the itemIds.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Listings updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        console.error("Error updating product listings:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating product listings.",
        });
    }
};




exports.updateServiceListings = async (req, res) => {
    const { itemIds, newStatus } = req.body;

    console.log("Updating Service Listings - itemIds:", itemIds, "New Status:", newStatus);

    // console.log(newStatus)
    // Check if itemIds and newStatus are provided
    if (!itemIds || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Please provide both itemIds and newStatus in the request body.",
        });
    }

    try {
        // Update the status of all listings with matching itemIds
        const updateResult = await ServiceListing.updateMany(
            { _id: { $in: itemIds } }, // Match listings by itemIds
            { status: newStatus }      // Set the new status
        );

        // Check if any listings were updated
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No listings were updated. Please check the itemIds.",
            });
        }
        return res.status(200).json({
            success: true,
            message: `Listings updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        console.error("Error updating service listings:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating service listings.",
        });
    }
};


exports.updateProductsRequirementListings = async (req, res) => {
    const { itemIds, newStatus } = req.body;
    // Check if itemIds and newStatus are provided
    if (!itemIds || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Please provide both itemIds and newStatus in the request body.",
        });
    }

    try {
        // Update the status of all listings with matching itemIds
        const updateResult = await ProductRequirementListing.updateMany(
            { _id: { $in: itemIds } }, // Match listings by itemIds
            { status: newStatus }      // Set the new status
        );

        // Check if any listings were updated
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No listings were updated. Please check the itemIds.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Listings updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        console.error("Error updating products requirements listings:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating products requirement listings.",
        });
    }
};


exports.updateServicesRequirementListings = async (req, res) => {
    const { itemIds, newStatus } = req.body;
    // Check if itemIds and newStatus are provided
    if (!itemIds || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Please provide both itemIds and newStatus in the request body.",
        });
    }

    try {
        // Update the status of all listings with matching itemIds
        const updateResult = await ServiceRequirementListing.updateMany(
            { _id: { $in: itemIds } }, // Match listings by itemIds
            { status: newStatus }      // Set the new status
        );

        // Check if any listings were updated
        if (updateResult.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "No listings were updated. Please check the itemIds.",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Listings updated to ${newStatus} successfully.`,
        });

    } catch (error) {
        console.error("Error updating services requirement listings:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating services requirement listings.",
        });
    }
};
