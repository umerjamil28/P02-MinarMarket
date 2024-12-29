import React, { useState, useEffect } from "react";
import SellerDashboardNavbar from "../components/SellerDashboardNavbar";

const BuyerProductRequirementsListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockListings = [
    {
      id: 1,
      title: "Laptop for Sale",
      description: "Selling a gently used laptop with 16GB RAM and 1TB SSD.",
      category: "Electronics",
      price: 800,
    },
    {
      id: 2,
      title: "Sofa Set",
      description: "A comfortable sofa set, perfect for your living room.",
      category: "Furniture",
      price: 300,
    },
    {
      id: 3,
      title: "Smartphone - Like New",
      description: "Latest smartphone, barely used. Comes with accessories.",
      category: "Electronics",
      price: 500,
    },
  ];

  const fetchListings = () => {
    setLoading(true);
    const filteredListings = mockListings.filter((listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setListings(filteredListings);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerDashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Buyer Product Requirements</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <p>No product requirements found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold">{listing.title}</h2>
                <p className="text-gray-600">{listing.description}</p>
                <p className="mt-2 text-emerald-600 font-semibold">${listing.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerProductRequirementsListings;
