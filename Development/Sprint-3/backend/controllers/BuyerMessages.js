
const express = require("express");
const BuyerMessage = require("../models/BuyerMessages");
const ProductListing = require("../models/ProductListing"); 
const ServiceListing = require("../models/ServiceListing"); // Import ServiceListing model

// Controller function to handle buyer messages for products and services
exports.createBuyerMessage = async (req, res) => {
    try {
        console.log("Buyer message request:", req.body);
        const { id_of_buyer, id_of_product, id_of_service } = req.body; 

        if (!id_of_buyer || (!id_of_product && !id_of_service)) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and either Product ID or Service ID are required.",
            });
        }

        let id_of_lister;
        let filter = { id_of_buyer };

        if (id_of_product) {
            filter.id_of_product = id_of_product;
            const product = await ProductListing.findById(id_of_product);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found." });
            }
            id_of_lister = product.listerId;
        } else {
            filter.id_of_service = id_of_service;
            const service = await ServiceListing.findById(id_of_service);
            if (!service) {
                return res.status(404).json({ success: false, message: "Service not found." });
            }
            id_of_lister = service.listerId;
        }

        // Check if a message already exists
        const existingMessage = await BuyerMessage.findOne(filter);
        if (existingMessage) {
            return res.status(409).json({ success: false, message: "Your request has already been processed." });
        }

        // Create a new BuyerMessage document
        const newMessage = new BuyerMessage({ id_of_buyer, id_of_lister, ...filter });
        await newMessage.save();

        return res.status(201).json({ success: true, message: "Buyer message saved successfully." });
    } catch (error) {
        console.error("Error saving buyer message:", error);
        return res.status(500).json({ success: false, message: "An error occurred while saving buyer message." });
    }
};

// Controller function to check if a buyer message already exists
exports.checkBuyerMessage = async (req, res) => {
    try {
        const { id_of_buyer, id_of_product, id_of_service } = req.query;

        if (!id_of_buyer || (!id_of_product && !id_of_service)) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and either Product ID or Service ID are required.",
            });
        }

        const filter = { id_of_buyer };
        if (id_of_product) {
            filter.id_of_product = id_of_product;
        } else {
            filter.id_of_service = id_of_service;
        }

        const existingMessage = await BuyerMessage.findOne(filter);

        return res.status(200).json({
            success: true,
            exists: !!existingMessage,
            message: existingMessage ? "Your request has already been processed." : "No previous request found.",
        });
    } catch (error) {
        console.error("Error checking buyer message:", error);
        return res.status(500).json({ success: false, message: "An error occurred while checking buyer message." });
    }
};
