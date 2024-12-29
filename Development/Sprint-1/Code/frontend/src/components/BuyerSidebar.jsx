import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom'; // Ensure you're using react-router-dom for navigation

const BuyerSidebar = () => {
  const [openSubMenu, setOpenSubMenu] = useState({
    Dashboard: true, // Keep Dashboard open by default
  });

  const toggleSubMenu = (menu) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Buyer</h1>
        <nav className="space-y-4">
          {/* Dashboard Link */}
          <div>
            <Link
              to="/buyer-dashboard"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span className="text-lg">⊞</span>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* My Purchases Section */}
          <div>
            <button
              onClick={() => toggleSubMenu('My Purchases')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 w-full"
            >
              <span className="text-lg">📦</span>
              <span>My Purchases</span>
              {openSubMenu['My Purchases'] ? (
                <ChevronDown className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
            {openSubMenu['My Purchases'] && (
              <div className="ml-6 space-y-2">
                <Link
                  to="/my-purchases/orders"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Orders
                </Link>
                <Link
                  to="/my-purchases/wishlist"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Wishlist
                </Link>
              </div>
            )}
          </div>


          {/* My Listings Link */}
          <div>
            <Link
              to="/my-listings"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              <span className="text-lg"></span>
              <span>My Listings</span>
            </Link>
          </div>

                        
          <Link
              to="/buyer-proposal"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              <span className="text-lg">📝</span>
              <span>Proposals</span>
            </Link>

          {/* Settings Link */}
          <div>
            <Link
              to="/settings"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
            >
              <span className="text-lg">⚙</span>
              <span>Settings</span>
            </Link>
          </div>
          <div className="p-4 flex justify-center">
                      <button className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600">
                        <a href='/seller-dashboard'>Switch to Seller</a>
                     </button>
                    </div>
        </nav>
      </div>
    </aside>
  );
};

export default BuyerSidebar;
