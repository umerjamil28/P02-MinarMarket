import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RouteGuard from "./components/RouteGuard";
import BuyerMyListings from "./pages/BuyerMyListings";
import ProductListingForm from "./pages/ProductListingForm";
import ServiceListing from "./pages/ServiceListing";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import SellerServicesDashboard from "./pages/SellerServicesDashboard";
import BuyerRequirementForm from "./pages/BuyerRequirementForm";
import BuyerProductRequirement from "./pages/BuyerProductRequirement";
import BuyerServicesRequirementsListings from "./pages/BuyerServicesRequirementsListings";
import BuyerProposal from './pages/BuyerProposal';
import SellerProposal from './pages/SellerProposal';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/seller-dashboard"
          element={
            <RouteGuard>
              <SellerDashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/seller-dashboard/services"
          element={
            <RouteGuard>
              <SellerServicesDashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/listing-form"
          element={
            <RouteGuard>
              <ProductListingForm />
            </RouteGuard>
          }
        />
        <Route
          path="/service-listing"
          element={
            <RouteGuard>
              <ServiceListing />
            </RouteGuard>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RouteGuard>
              <AdminDashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/buyer-dashboard"
          element={
            <RouteGuard>
              <BuyerDashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/my-listings"
          element={
            <RouteGuard>
              <BuyerMyListings />
            </RouteGuard>
          }
        />
        <Route
          path="/buyer-listings"
          element={
            <RouteGuard>
              <BuyerProductRequirement />
            </RouteGuard>
          }
        />
        <Route
          path="/buyer-requirement-form"
          element={
            <RouteGuard>
              <BuyerRequirementForm />
            </RouteGuard>
          }
        />
        <Route
          path="/buyer-services-listings"
          element={
            <RouteGuard>
              <BuyerServicesRequirementsListings />
            </RouteGuard>
          }
        />
        <Route
          path="/buyer-proposal"
          element={
            <RouteGuard>
              <BuyerProposal />
            </RouteGuard>
          }
          />
        <Route
          path="/seller-proposal"
          element={
            <RouteGuard>
              <SellerProposal />
            </RouteGuard>
          }
          />
      </Routes>

        
    </Router>
  );
}

export default App;
