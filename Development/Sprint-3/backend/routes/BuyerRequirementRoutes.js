const express = require("express");
const router = express.Router();


const { listProduct, myListings, deleteListings, updateListings, fetchProductRequirementDetails } = require("../controllers/BuyerRequirementController");
// Route for listing a product
router.post("/", listProduct);
router.get("/", myListings)
router.get("/fetch-product-requirement-details/:productRequirementId", fetchProductRequirementDetails);
router.post("/delete", deleteListings)
router.post("/update", updateListings)

// console.log("Route wala API: ", process.env.REACT_APP_API_URL+"/api/buyer-requirement")

module.exports = router;
