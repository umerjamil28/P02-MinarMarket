const express = require("express");
const router = express.Router();

const {
  addServiceListing,
  showServiceListings,
  fetchServiceListing,
  updateServiceListing,
  showMyServiceListings,
  fetchServiceCategoryListings,
  fetchLandingPageServices,
  fetchCategoryLandingPage
} = require("../controllers/ServiceListingController");


// Route to add a new service listing
router.post("/", addServiceListing);

// Route to show all approved service listings
router.get("/", showServiceListings);

router.get("/my-listings", showMyServiceListings);

// Route to fetch details of a specific service listing
router.get("/fetch-service-details/:serviceId", fetchServiceListing);

// Route to update a specific service listing
router.put("/updateService/:serviceId", updateServiceListing);

router.post('/fetch-category/:category', fetchServiceCategoryListings);

router.get('/fetch-landing-page-services', fetchLandingPageServices);

router.get('/fetch-category-landing-page/:category', fetchCategoryLandingPage);

module.exports = router;
