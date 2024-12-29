import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const AdminSidebar = () => {
    const [openSubMenu, setOpenSubMenu] = useState({
      'My Listings': true // Set to true by default to match the design
    });
  
    const toggleSubMenu = (menu) => {
      setOpenSubMenu((prev) => ({
        ...prev,
        [menu]: !prev[menu],
      }));
    };
  
    return (
      <div className="w-64 min-h-screen bg-white border-r border-gray-200">
        <div className="p-4">
          <div className="space-y-4">
            {/* Admin Header */}
            <div className="text-lg font-semibold text-gray-800">
              Admin
            </div>
  
            {/* Dashboard Item */}
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="text-lg">⊞</span>
              <span>Dashboard</span>
            </div>
  
            {/* My Listings Section */}
            <div>
              <div className="flex items-center mb-2">
                <button
                  onClick={() => toggleSubMenu('My Listings')}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <span className="text-lg">◎</span>
                  <span>Manage Listings</span>
                  {/* {openSubMenu['My Listings'] ? (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )} */}
                </button>
                
              </div>
              
              {/* {openSubMenu['My Listings'] && (
                <div className="ml-6 space-y-2">
                  <div className="text-blue-600">Products</div>
                  <div className="text-gray-600">Services</div>
                </div>
              )} */}
            </div>
  
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-lg">⚙</span>
              <span>Manage Users</span>
            </div>

            {/* Settings Item */}
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-lg">⚙</span>
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
    );
  };


  export default AdminSidebar;
