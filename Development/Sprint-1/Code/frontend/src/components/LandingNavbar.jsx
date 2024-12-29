import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-600">
              Minar Market
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About us</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Sign In
            </Link>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <Globe className="h-5 w-5 mr-1" />
              English
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

