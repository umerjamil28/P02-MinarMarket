const express = require("express");
const router = express.Router();


const { showbuyerProductListings } = require("../controllers/BuyerProductRequirementController");

// Route for listing a product
router.get("/", showbuyerProductListings);

// console.log("Route wala API: ", process.env.REACT_APP_API_URL+"/api/buyer-requirement")

module.exports = router;
