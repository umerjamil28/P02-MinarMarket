import React from "react";
import { useNavigate, Link } from "react-router-dom";

const SellerDashboardNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Left side - Logo, Home, Profile */}
        <div className="flex items-center space-x-4 pl-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/seller-dashboard" className="text-black hover:text-gray-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-500 hover:text-gray-600">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Right side - Actions */}
        <div className="flex space-x-4 mr-4">
          <Link
            to="/listing-form"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            List Product
          </Link>
          <Link
            to="/service-listing"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            List Service
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SellerDashboardNavbar;
