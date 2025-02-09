
const express = require("express");
const BuyerMessage = require("../models/BuyerMessages");
const ProductListing = require("../models/ProductListing"); // Import ProductListing model

// Controller function to handle buyer messages
exports.createBuyerMessage = async (req, res) => {
    try {
        const { id_of_buyer, id_of_product } = req.body; // Extract buyer and product IDs

        console.log("Buyer ID:", id_of_buyer, "Product ID:", id_of_product);

        if (!id_of_buyer || !id_of_product) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and Product ID are required.",
            });
        }

        // Check if the buyer has already sent a message for this product
        const existingMessage = await BuyerMessage.findOne({ id_of_buyer, id_of_product });

        if (existingMessage) {
            return res.status(409).json({
                success: false,
                message: "Your request has already been processed.",
            });
        }

        // Fetch product to get the listerId
        const product = await ProductListing.findById(id_of_product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const id_of_lister = product.listerId; // Extract lister ID

        // Create a new BuyerMessage document
        const newMessage = new BuyerMessage({
            id_of_buyer,
            id_of_product,
            id_of_lister, // Save the extracted listerId
        });

        await newMessage.save();

        return res.status(201).json({
            success: true,
            message: "Buyer message saved successfully.",
        });
    } catch (error) {
        console.error("Error saving buyer message:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while saving buyer message.",
        });
    }
};

// Controller function to check if a buyer message already exists
exports.checkBuyerMessage = async (req, res) => {
    try {
        const { id_of_buyer, id_of_product } = req.query;

        if (!id_of_buyer || !id_of_product) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and Product ID are required.",
            });
        }

        const existingMessage = await BuyerMessage.findOne({ id_of_buyer, id_of_product });

        if (existingMessage) {
            return res.status(200).json({
                success: true,
                message: "Your request has already been processed.",
                exists: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: "No previous request found.",
            exists: false,
        });

    } catch (error) {
        console.error("Error checking buyer message:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while checking buyer message.",
        });
    }
};
