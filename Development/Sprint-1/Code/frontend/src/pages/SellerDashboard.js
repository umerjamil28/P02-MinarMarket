import SellerDashboardNavbar from "../components/SellerDashboardNavbar";
import SellerSidebar from "../components/SellerSidebar";
import React, { useState, useEffect } from "react";
import { getUserDetails } from "../components/SessionManager";
import { ChevronRight, ChevronDown } from "lucide-react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  // State to track selected items
  const [selectedItems, setSelectedItems] = useState([]);
  // Sample data array
  const [listings, setListings] = useState([
    { id: "#A1DA59", date: "23/09/2024", title: "Laptop", status: "Approved" },
    { id: "#A1DA58", date: "23/09/2024", title: "Camera", status: "Pending" },
  ]);

  const [userDetails, setUserDetails] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Call getUserDetails to log and store user details
    const tempuserDetails = getUserDetails();
    if (tempuserDetails) {
      console.log("SELLER DASHBOARD WALA TEMP USER:",tempuserDetails);
      setUserDetails(tempuserDetails);
    }
  }, []);

  const getSellerListing = async () => {
    if (!userDetails) return;
  
    const userId = userDetails.userId; // Extract userId from userDetails
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/seller-listings?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const result = await response.json();
        console.log("Seller Listings:", result);
        if (result.success && Array.isArray(result.data)) {
          setSellerListings(result.data); // Correctly setting the seller listings array
        } else {
          console.error("Error: Invalid data structure", result);
        }
      } else {
        console.error("Failed to fetch seller listings:", response.status);
      }
    } catch (error) {
      console.error("Error fetching seller listings:", error);
    }
  };

  const handleEditClick = (listingId) => {
    navigate(`/listing-form`, { state: { productId: listingId } }); // Pass the product ID using state
  };
  

  useEffect(() => {
    getSellerListing(); // Call getSellerListing on component mount
  }, [userDetails]); // Run when userDetails is set

  // Handle individual checkbox selection
  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  useEffect(() => {
    // Call getUserDetails to log and store user details
    const userDetails = getUserDetails();
    if (userDetails) {
      console.log("User Name:", userDetails.name);
      console.log("User Email:", userDetails.email);
    }
  }, []);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === listings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listings.map((item) => item.id));
    }
  };

const handleDelete = async () => {
  if (selectedItems.length === 0) return;

  try {
      const response = await fetch(process.env.REACT_APP_API_URL+'/deactivate-listings', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              listingIds: selectedItems, // Send the selected user IDs
              type: "product"
            }),
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Listings deactivated:', data);

          // After successful deletion, re-fetch the listings
          getSellerListing();
      } else {
          console.error('Failed to deactivate Listings:', response.status);
      }
  } catch (error) {
      console.error('Error during deactivation:', error);
  }
};



  return (
    <div className="flex flex-col min-h-screen">
      <SellerDashboardNavbar />
      <div className="flex flex-1">
        <SellerSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="space-x-2">
              
              <button
                onClick={handleDelete}
                disabled={selectedItems.length === 0}
                className={`px-4 py-2 rounded ${
                  selectedItems.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Delete Selected
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === listings.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="pb-2">Listing ID</th>
                  <th className="pb-2">Date Listed</th>
                  <th className="pb-2">Product Title</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {sellerListings.map((listing) => (
                  <tr key={listing._id} className="border-b last:border-b-0">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(listing._id)}
                        onChange={() => handleCheckboxChange(listing._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 text-blue-600">{listing._id}</td>
                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td>{listing.title}</td>
                    <td>

                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          listing.status === "Approved"
                            ? "text-green-600 bg-green-100"
                            : listing.status === "Pending"
                            ? "text-yellow-600 bg-yellow-100"
                            : "text-red-600 bg-red-100"
                        }`}>
                        {listing.status}
                      </span>

                    </td>
                    
                    <td className="text-blue-600 hover:underline hover:cursor-pointer" onClick={() => handleEditClick(listing._id)}>Edit Product Details</td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default SellerDashboard;
