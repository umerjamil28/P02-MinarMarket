const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routes
const UserAuthRoutes = require('./routes/UserAuthRoutes');
const AddProductListing = require('./routes/ProductListingRoutes');
const SellerListing = require('./routes/SellerListingRoutes');
const DeleteSellerListing = require('./routes/DeleteSellerListingRoutes');
const AllProductsListing = require('./routes/AdminListingRoutes');
const UpdateProductsListing = require('./routes/AdminListingRoutes');
const AllServicesListing = require('./routes/ServiceListingRoutes');
const AddServiceListing = require('./routes/ServiceListingRoutes');
const Bids = require('./routes/Bid'); // For Buyer Bids
const BuyerRequirement = require('./routes/BuyerRequirementRoutes');
const BuyerProductRequirementController = require('./routes/BuyerProductRequirementRoutes');
const ServiceListingRoutes = require('./routes/ServiceListingRoutes');
const ProductListingRoutes = require('./routes/ProductListingRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(cookieParser());

/// PRODUCTION
// Uncomment the following line for production with request verification middleware
// app.use('/api/authentication', verifyAPIRequest, UserAuthRoutes);

// LOCAL HOST TESTING
app.use('/api/authentication', UserAuthRoutes);
app.use('/addProductListing', AddProductListing);
app.use('/addServiceListing', AddServiceListing);
app.use('/seller-listings', SellerListing);
app.use('/deactivate-listings', DeleteSellerListing);
app.use('/admin-product-listings', AllProductsListing);
app.use('/update-listings-status', UpdateProductsListing);
app.use('/service-listings', AllServicesListing);

// Unified Product and Service Listings Routes
app.use('/product-listings', ProductListingRoutes);
app.use('/service-listings', ServiceListingRoutes);
//for Buyer Bids
app.use('/bids/', Bids);
app.use('/buyer-requirement', BuyerRequirement);
app.use('/buyer-product-requirement', BuyerProductRequirementController);
app.use('/buyer-listings', BuyerRequirement);
app.use('/buyer-listings/delete', BuyerRequirement);
app.use('/buyer-listings/update', BuyerRequirement);

app.use('/proposals', require('./routes/ProposalRoutes'));
// console.log("App.js wala API: ", process.env.REACT_APP_API_URL+"/api/buyer-requirement")

module.exports = app;
