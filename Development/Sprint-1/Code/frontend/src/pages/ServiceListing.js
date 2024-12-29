import React from 'react';
import SellerDashboardNavbar from "../components/SellerDashboardNavbar";
import Footer from "../components/Footer";
import ServiceListingForm from "../components/ServiceListingForm";

const ServiceListing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SellerDashboardNavbar />
      <main className="flex-1 p-6">
        
        <ServiceListingForm />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceListing;