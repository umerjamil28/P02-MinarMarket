const express = require("express");
const router = express.Router();

const {
  addServiceListing,
  showServiceListings,
  fetchServiceListing,
  updateServiceListing,
} = require("../controllers/ServiceListingController");

// Route to add a new service listing
router.post("/", addServiceListing);

// Route to show all approved service listings
router.get("/", showServiceListings);

// Route to fetch details of a specific service listing
router.get("/fetch-service-details/:serviceId", fetchServiceListing);

// Route to update a specific service listing
router.put("/updateService/:serviceId", updateServiceListing);

module.exports = router;
