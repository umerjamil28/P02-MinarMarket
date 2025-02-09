const BuyerRequirement = require('../models/BuyerRequirement');

exports.showbuyerProductListings = async (req, res) => {
    try {
        const userId = req.query.userId;
        
        const productListings = await BuyerRequirement.find({
            status: 'Approved',
            isActive: true,
            listerId: { $ne: userId }
        });

        if (!productListings || productListings.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No requirements found',
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Requirements retrieved successfully',
            data: productListings
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};