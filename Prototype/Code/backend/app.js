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
// const SellerListing = require('./routes/SellerListingRoutes')
const Bids = require('./routes/Bid');//for Buyer Bids

// const { verifyAPIRequest } = require('./middleware/authAPIRequest');


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
app.use(bodyParser.json({ limit: '150mb' }));

app.use(cookieParser());

/// PRODUCTION
// app.use('/api/authentication', verifyAPIRequest, UserAuthRoutes);




// LOCAL HOST TESTING
app.use('/api/authentication',  UserAuthRoutes);
app.use('/addProductListing', AddProductListing);
app.use('/seller-listings', SellerListing); // Add this line
app.use('/deactivate-listings', DeleteSellerListing);
app.use('/admin-product-listings', AllProductsListing);
app.use('/update-listings-status', UpdateProductsListing);
// app.use('/deactivate-listings', DeleteSellerListingRoutes)
app.use('/product-listings', require('./routes/ProductListingRoutes'));
//for Buyer Bids
app.use('/bids/', Bids);


module.exports = app;

