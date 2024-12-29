import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Wrench, Truck, Package, Paintbrush, Computer, BookOpen, Coffee, Home, Heart, ChevronRight, Globe } from 'lucide-react';

const Navbar = () => (
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

const CategoryCard = ({ title, subtitle, items, color, delay }) => (
  <motion.div
    className={`p-8 rounded-2xl ${color} text-white relative overflow-hidden`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="space-y-2 mb-6">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-3xl font-light">{subtitle}</p>
    </div>
    <ul className="space-y-4">
      {items.map((item, index) => (
        <motion.li
          key={index}
          className="flex items-center space-x-3 text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.1 * index }}
        >
          {item.icon}
          <span>{item.text}</span>
        </motion.li>
      ))}
    </ul>
    <ChevronRight className="absolute bottom-4 right-4 h-8 w-8" />
  </motion.div>
);

const LandingPage = () => {
  const categories = [
    {
      title: "Buy",
      subtitle: "products",
      color: "bg-emerald-600",
      items: [
        { icon: <ShoppingBag className="h-6 w-6" />, text: "Electronics" },
        { icon: <Home className="h-6 w-6" />, text: "Home & Living" },
        { icon: <Package className="h-6 w-6" />, text: "Fashion" },
        { icon: <Heart className="h-6 w-6" />, text: "Health & Beauty" },
      ]
    },
    {
      title: "Hire",
      subtitle: "services",
      color: "bg-blue-600",
      items: [
        { icon: <Wrench className="h-6 w-6" />, text: "Repairs" },
        { icon: <Paintbrush className="h-6 w-6" />, text: "Home Services" },
        { icon: <Computer className="h-6 w-6" />, text: "Tech Support" },
        { icon: <BookOpen className="h-6 w-6" />, text: "Education" },
      ]
    },
    {
      title: "Post",
      subtitle: "requests",
      color: "bg-purple-600",
      items: [
        { icon: <ShoppingBag className="h-6 w-6" />, text: "Product Requests" },
        { icon: <Wrench className="h-6 w-6" />, text: "Service Needs" },
        { icon: <Coffee className="h-6 w-6" />, text: "Custom Orders" },
        { icon: <Truck className="h-6 w-6" />, text: "Bulk Requirements" },
      ]
    },
    {
      title: "Connect",
      subtitle: "directly",
      color: "bg-gray-800",
      items: [
        { icon: <ShoppingBag className="h-6 w-6" />, text: "Chat with Sellers" },
        { icon: <Package className="h-6 w-6" />, text: "Track Orders" },
        { icon: <Heart className="h-6 w-6" />, text: "Save Favorites" },
        { icon: <Coffee className="h-6 w-6" />, text: "Meet Local Sellers" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Marketplace for Everything
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              subtitle={category.subtitle}
              items={category.items}
              color={category.color}
              delay={0.2 * index}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
