const express = require('express');
const Bid = require('../models/BuyerBids'); // Assuming you have a Bid model

const router = express.Router();

// Route to add a new bid
router.post('/add', async (req, res) => {
    const { userId, itemId, bidAmount } = req.body;

    if (!userId || !itemId || !bidAmount) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBid = new Bid({
            userId,
            itemId,
            bidAmount,
            bidTime: new Date()
        });

        await newBid.save();
        res.status(201).json({ message: 'Bid added successfully', bid: newBid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.delete('/remove', async (req, res) => {
    const { userId, itemId, bidAmount } = req.body;

    if (!userId || !itemId || !bidAmount) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBid = new Bid({
            userId,
            itemId,
            bidAmount,
            bidTime: new Date()
        });

        await newBid.save();
        res.status(201).json({ message: 'Bid added successfully', bid: newBid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        const bids = await Bid.find({ itemId }).sort({ bidAmount: -1 });
        res.status(200).json({ bids });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


module.exports = router;