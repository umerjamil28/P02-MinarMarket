import React, { useState, useEffect } from "react";
import BuyerSidebar from "../components/BuyerSidebar";
import Footer from "../components/Footer";

const BuyerDashboard = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL+"/product-listings");
        const data = await res.json();
        setFeaturedProducts(data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    const fetchFeaturedServices = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL+"/api/featured-services");
        const data = await res.json();
        setFeaturedServices(data);
      } catch (error) {
        console.error("Error fetching featured services:", error);
      }
    };

    fetchFeaturedProducts();
    // fetchFeaturedServices();  
  }, []);
  const addBid = (productID) => {
    
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow w-full">
        <div className="text-xl font-bold">Minar Market</div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-blue-500">About</a>
          <div>
            <select className="border border-gray-300 p-2 rounded">
              <option>All</option>
              <option>Products</option>
              <option>Services</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 p-2 rounded w-64"
          />
          <a href="#" className="hover:text-blue-500">❤</a>
          <a href="#" className="hover:text-blue-500">🛒</a>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            List Requirement
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded">Log out</button>
        </div>
      </nav>

      <div className="flex flex-1">
        <BuyerSidebar />
        <main className="flex-1 p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Featured Products */}
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">{product.title}</h2>
                <div className="h-40 bg-gray-300 mb-4">
                  <img
                    src={`${product.images[0].url || ""}`}
                    alt={product.title}
                    className="object-cover h-full w-full"
                    style={{ aspectRatio: '16/9' }}
                  />
                </div>
                <p className="text-lg font-semibold mb-4">${product.price}</p>
                <div className="flex justify-between">
                  <button className="bg-black text-white px-4 py-2 rounded">
                    Buy Now
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Learn More
                  </button>
                </div>
              </div>
            ))}

            {/* Sale Section */}
            {/* <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">SALE</h2>
              <div className="h-40 bg-gray-300"></div>
            </div> */}

            {/* My Listings */}
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">My Listings</h2>
              <div className="h-40 bg-gray-300"></div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BuyerDashboard;
