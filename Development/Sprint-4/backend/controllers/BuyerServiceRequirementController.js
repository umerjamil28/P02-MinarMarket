const BuyerServiceRequirement = require('../models/BuyerServiceRequirement');

exports.listServiceRequirement = async (req, res) => {
    try {
        const { title, description, rate, pricingModel, category, city, userId, images } = req.body;

        if (!title || !description || !rate || !category || !city || !pricingModel) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check that no more than 6 images are being uploaded
        if (images && images.length > 6) {
            return res.status(400).json({
                success: false,
                message: "You can upload a maximum of 6 images.",
            });
        }

        const newRequirement = new BuyerServiceRequirement({
            title,
            description,
            rate,
            pricingModel,
            category,
            city,
            listerId: userId,
            images: images || [] // Include images if provided
        });

        await newRequirement.save();

        return res.status(201).json({
            success: true,
            message: 'Service requirement added successfully',
            data: newRequirement
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update service requirement with images
exports.updateServiceRequirement = async (req, res) => {
    try {
        const { serviceRequirementId } = req.params;
        const { title, description, rate, pricingModel, category, city, images, userId } = req.body;

        // Validate required fields
        if (!title || !description || !rate || !category || !city || !pricingModel) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check that no more than 6 images are being uploaded
        if (images && images.length > 6) {
            return res.status(400).json({
                success: false,
                message: "You can upload a maximum of 6 images.",
            });
        }

        // Find the requirement and verify ownership
        const requirement = await BuyerServiceRequirement.findOne({
            _id: serviceRequirementId,
            listerId: userId
        });

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Service requirement not found or you don't have permission to update it."
            });
        }

        // Update the fields
        requirement.title = title;
        requirement.description = description;
        requirement.rate = rate;
        requirement.pricingModel = pricingModel;
        requirement.category = category;
        requirement.city = city;
        requirement.images = images || requirement.images;
        requirement.status = "Pending"; // Reset status to pending after update
        
        await requirement.save();

        return res.status(200).json({
            success: true,
            message: 'Service requirement updated successfully',
            data: requirement
        });
    } catch (error) {
        console.error('Error updating service requirement:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getMyServiceRequirements = async (req, res) => {
    try {
        const userId = req.query.userId;
        const requirements = await BuyerServiceRequirement.find({ listerId: userId });

        return res.status(200).json({
            success: true,
            data: requirements
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


exports.fetchServiceRequirementDetails = async (req, res) => {
    try {
        const { serviceRequirementId } = req.params;

        const requirement = await BuyerServiceRequirement.findById(serviceRequirementId);

        if (!requirement) {
            return res.status(404).json({
                success:false,
                message: "Service Requirement Not Found."
            });
        }

        res.status(200).json({
            success:true,
            data:requirement
        });
    } catch (error) {
        console.error('Error fetching details of the serviceRequirement:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the details of the serviceRequirement.'
        });
    }
};
exports.getAllServiceRequirements = async (req, res) => {
    try {
        const requirements = await BuyerServiceRequirement.find({ 
            status: "Approved", 
            isActive: true,
            listerAccountStatus: "Active"
        });

        return res.status(200).json({
            success: true,
            data: requirements
        });
    } catch (error) {
        console.error('Error fetching service requirements:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

