import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import React, { useState, useEffect } from "react";
import { getUserDetails } from "../components/SessionManager";
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedData = jwtDecode(token);
        
        if(!decodedData.admin){
          window.location.href = '/';
           
        }          
        
      } catch (error) {
        console.error('Invalid token:', error); // Handle any error if token is not valid
      }
    } 
    const tempUserDetails = getUserDetails();
    if (tempUserDetails) {
      setUserDetails(tempUserDetails);
    }
  }, []);

  const getAllListings = async () => {
    if (!userDetails) return;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin-product-listings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const result = await response.json();
  
        if (result.success && Array.isArray(result.data)) {
      
          const listingsWithSellerName = result.data.map(listing => ({
            ...listing,
            sellerName: listing.listerId?.name || "N/A"  
          }));
          setSellerListings(listingsWithSellerName);
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
  
  
  useEffect(() => {
    getAllListings();
  }, [userDetails]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sellerListings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sellerListings.map((item) => item._id));
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (selectedItems.length === 0) return;

    const pendingOnly = selectedItems.every(
      (id) => sellerListings.find((item) => item._id === id).status === "Pending"
    );

    if (!pendingOnly) {
      console.log("Only pending listings can be approved or rejected.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin-product-listings/update-listings-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds: selectedItems, newStatus }),
      });

      if (response.ok) {
        alert(`Selected listing(s) ${newStatus} successfully.`)
        console.log(`Selected items updated to ${newStatus} successfully.`);
        getAllListings();
        setSelectedItems([]);
      } else {
        console.error(`Failed to update selected items:`, response.status);
      }
    } catch (error) {
      console.error(`Error updating selected items to ${newStatus}:`, error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Products</h1>
            <div className="space-x-2">
              <button
                onClick={() => handleStatusUpdate("Approved")}
                disabled={selectedItems.length === 0 || !selectedItems.every(id => sellerListings.find(listing => listing._id === id)?.status === "Pending")}
                className={`px-4 py-2 rounded ${
                  selectedItems.length === 0 || !selectedItems.every(id => sellerListings.find(listing => listing._id === id)?.status === "Pending")
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("Rejected")}
                disabled={selectedItems.length === 0 || !selectedItems.every(id => sellerListings.find(listing => listing._id === id)?.status === "Pending")}
                className={`px-4 py-2 rounded ${
                  selectedItems.length === 0 || !selectedItems.every(id => sellerListings.find(listing => listing._id === id)?.status === "Pending")
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Reject
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
                      checked={selectedItems.length === sellerListings.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="pb-2">Listing ID</th>
                  <th className="pb-2">Seller</th>
                  <th className="pb-2">Date Listed</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Status</th>
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
                    <td>{listing.sellerName}</td>
                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td>{listing.title}</td>
                    <td>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          listing.status === "Approved"
                            ? "text-green-600 bg-green-100"
                            : listing.status === "Rejected"
                            ? "text-red-600 bg-red-100"
                            : "text-yellow-600 bg-yellow-100"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <footer className="border-t border-gray-200 py-4">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-end space-x-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">
            Help Center
          </a>
          <a href="#" className="hover:text-gray-900">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-900">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;

