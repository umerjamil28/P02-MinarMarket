const BuyerBid = require('../models/BuyerBids');
const mongoose = require('mongoose');

const BuyerBidController = {
    getAllBids: (req, res) => {
        //Get all bids from the database
        BuyerBid.find()
            .then((bids) => {
                res.json(bids);
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    message: 'Error getting bids.',
                    error: error.message,
                });
            });



    },

    getBidById: (req, res) => {
        const bidId = req.params.id;
        // Logic to get a bid by ID
        BuyerBid.findById(bidId)
            .then((bid) => {
                if (!bid) {
                    return res.status(404).json({
                        success: false,
                        message: 'Bid not found.',
                    });
                }
                res.json(bid);
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    message: 'Error getting bid.',
                    error: error.message,
                });
            });

    },

    createBid: (req, res) => {
        const { productId, buyerId, bidPrice } = req.body;
        // Logic to create a new bid
        const newBid = new BuyerBid({
            productId,
            buyerId,
            bidPrice,
        });
        newBid.save()
            .then((bid) => {
                res.status(201).json({
                    success: true,
                    message: 'Bid created successfully.',
                    data: bid,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    message: 'Error creating bid.',
                    error: error.message,
                });
            });
    },

    updateBid: (req, res) => {
        const bidId = req.params.id;
        const updatedBid = req.body;
        // Logic to update a bid by ID
        
    },

    deleteBid: (req, res) => {
        const bidId = req.params.id;
        // Logic to delete a bid by ID
        res.send(`Delete bid with ID: ${bidId}`);
    }
};

module.exports = BuyerBidController;
// Accept a bid
BuyerBidController.acceptBid = async (req, res) => {
    try {
        const bidId = req.params.id;
        const bid = await BuyerBid.findByIdAndUpdate(
            bidId,
            { bidStatus: 'Accepted' },
            { new: true }
        );
        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found.',
            });
        }
        res.status(200).json({
            success: true,
            data: bid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error accepting bid.',
            error: error.message,
        });
    }
};

// Reject a bid
BuyerBidController.rejectBid = async (req, res) => {
    try {
        const bidId = req.params.id;
        const bid = await BuyerBid.findByIdAndUpdate(
            bidId,
            { bidStatus: 'Rejected' },
            { new: true }
        );
        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found.',
            });
        }
        res.status(200).json({
            success: true,
            data: bid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting bid.',
            error: error.message,
        });
    }
};