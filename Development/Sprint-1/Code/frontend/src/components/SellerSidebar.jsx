import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const SellerSidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState({
    "My Listings": true,
    "Buyer Listings": false,
  });

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex-1">
        <div className="space-y-4">
          {/* Sidebar Header */}
          <div className="text-lg font-semibold text-gray-800">Seller</div>

          {/* Dashboard Item */}
          <div className="flex items-center space-x-2 text-blue-600">
            <span className="text-lg">⊞</span>
            <Link to="/seller-dashboard">Dashboard</Link>
          </div>

          {/* My Listings Section */}
          <div>
            <div className="flex items-center mb-2">
              <button
                onClick={() => toggleSubMenu("My Listings")}
                className="flex items-center space-x-2 text-gray-600"
              >
                <span className="text-lg">◎</span>
                <span>My Listings</span>
                {openSubMenu["My Listings"] ? (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                ) : (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            </div>
            {openSubMenu["My Listings"] && (
              <div className="ml-6 space-y-2">
                <div>
                  <Link
                    to="/seller-dashboard"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                  >
                    <span>Products</span>
                  </Link>
                </div>
                <div>
                  <Link
                    to="/seller-dashboard/services"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                  >
                    <span>Services</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Buyer Listings Section */}
          <div>
            <div
              className="flex items-center space-x-2 text-gray-600 cursor-pointer"
              onClick={() => toggleSubMenu("Buyer Listings")}
            >
              <span className="text-lg">📋</span>
              <span>Buyer Listings</span>
              {openSubMenu["Buyer Listings"] ? (
                <ChevronDown className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </div>
            {openSubMenu["Buyer Listings"] && (
              <div className="ml-6 space-y-2">
                <div>
                  <Link
                    to="/buyer-listings"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                  >
                    <span>Product Requirements</span>
                  </Link>
                </div>
                <div>
                  <Link
                    to="/buyer-services-listings"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                  >
                    <span>Service Requirements</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
            
            <Link
              to="/seller-proposal"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              <span className="text-lg">📝</span>
              <span>Proposals</span>
            </Link>
            
          {/* Settings Section */}
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-lg">⚙</span>
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Switch to Buyer Button */}
      <div className="p-4">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-green-600 transition-all">
          <Link to="/buyer-dashboard">Switch to Buyer</Link>
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;
