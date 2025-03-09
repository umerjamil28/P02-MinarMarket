const express = require("express");
const router = express.Router();

const { getAllProductListings, getUpdateProductListings, getAllServiceListings, updateServiceListings, getAllProductsRequirementListings, updateProductsRequirementListings, getAllServicesRequirementListings, updateServicesRequirementListings } = require("../controllers/AdminListingController");

router.get("/", getAllProductListings);
// router.post("/seller-services", getAllServiceListings);
// router.post("/", getAllBuyerProductRequirements);
// router.put("/", getAllBuyerServiceRequirements);
router.put("/update-listings-status", getUpdateProductListings);
router.get("/admin-service-listings", getAllServiceListings);
router.put("/update-service-listing-status", updateServiceListings);
router.get("/admin-products-requirement-listings", getAllProductsRequirementListings);
router.put("/update-products-requirement-listings-status", updateProductsRequirementListings);
router.get("/admin-services-requirement-listings", getAllServicesRequirementListings);
router.put("/update-services-requirement-listings-status", updateServicesRequirementListings);

module.exports = router;
