
import React, { useState, useEffect } from "react";
import { Filter, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import SellerDashboardNavbar from "../components/SellerDashboardNavbar";

import ProposalModal from "../components/ProposalModal";
import { getUserDetails } from "../components/SessionManager";

const BuyerProductRequirement = () => {
  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const userDetails = getUserDetails();
  const handleProposalSubmit = async (proposalData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: selectedListing.listerId,
          sellerId: userDetails.userId,
          requirementId: selectedListing._id,
          price: proposalData.price,
          description: proposalData.description
        })
      });

      if (response.ok) {
        alert('Proposal sent successfully!');
        setIsModalOpen(false);
      } else {
        throw new Error('Failed to send proposal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };
  // Fetch buyer listings from the backend
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/buyer-product-requirement");
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        // Update listings based on API response structure
        setListings(data.data || []); // Assuming API response wraps listings in "data"
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]); // Fallback to an empty array in case of error
      } finally {
        setLoading(false);
      }
    };
  
    fetchListings();
  }, []);
  

  const toggleSaved = (listingId) => {
    setSavedListings((prev) =>
      prev.includes(listingId)
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleContact = (listing) => {
    setSelectedListing(listing);
    console.log("Selected Listing:", listing);
    setIsModalOpen(true);
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerDashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Buyer Listings</h1>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{listing.title}</h2>
                  <button
                    className="text-gray-600"
                    onClick={() => toggleSaved(listing._id)}
                  >
                    {savedListings.includes(listing._id) ? (
                      <BookmarkCheck className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{listing.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Budget: ${listing.price}</span>
                  <span>Date Modified: {new Date(listing.updatedAt).toLocaleDateString()}</span>
                </div>
                <button
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                  onClick={() => handleContact(listing)}
                >
                  <MessageCircle className="h-4 w-4 mr-2 inline-block" />
                  Contact Buyer
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProposalSubmit}
        listing={selectedListing}
      />
    
    </div>
  );

 
  
};




export default BuyerProductRequirement;
