const express = require("express");
const router = express.Router();

const { getAllProductListings, getUpdateProductListings } = require("../controllers/AdminListingController");

router.get("/", getAllProductListings);
router.put("/update-listings-status", getUpdateProductListings);

module.exports = router;
