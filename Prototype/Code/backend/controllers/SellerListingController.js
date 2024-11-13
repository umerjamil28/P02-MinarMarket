const ProductListing = require('../models/ProductListing'); // Import the ProductListing model
// const User = require('../models/User');
// Controller to handle fetching product listings by user ID
exports.getSellerListings = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required to fetch seller listings.',
            });
        }

        // Fetch products with listerId matching userId
        const products = await ProductListing.find({ listerId: userId, isActive: 1 });

        // Check if products were found
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No listings found for this user.',
            });
        }

        // Send a success response with the products
        return res.status(200).json({
            success: true,
            message: 'Seller listings fetched successfully.',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching seller listings:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching seller listings.',
        });
    }
};


// Controller to handle deletion of listings by item IDs
exports.deactivateListings = async (req, res) => {
    // console.log("IDR HU");
    const { userIds } = req.body; // Expecting an array of userIds

    try {
        // Update the isActive status of all users in the userIds array
        const result = await ProductListing.updateMany(
            { _id: { $in: userIds } },
            { $set: { isActive: false } }
        );

        // If no users were updated, send a 404 response
        if (result.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users were deactivated.',
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Users deactivated successfully.',
        });
    } catch (error) {
        console.error('Error deactivating users:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deactivating users.',
        });
    }
};