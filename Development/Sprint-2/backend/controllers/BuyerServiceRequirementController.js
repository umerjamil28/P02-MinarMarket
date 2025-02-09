const BuyerServiceRequirement = require('../models/BuyerServiceRequirement');

exports.listServiceRequirement = async (req, res) => {
    try {
        const { title, description, rate, pricingModel, category, city, userId } = req.body;

        if (!title || !description || !rate || !category || !city || !pricingModel) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newRequirement = new BuyerServiceRequirement({
            title,
            description,
            rate,
            pricingModel,
            category,
            city,
            listerId: userId
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
