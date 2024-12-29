import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/'); // Use navigate instead of history.push
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Left side - Logo, Home, Profile */}
        <div className="flex items-center space-x-4 pl-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-black hover:text-gray-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-600">
                Profile
              </a>
            </li>
          </ul>
        </div>

        {/* Right side - with increased spacing */}
        <div className="flex space-x-6 mr-4">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
