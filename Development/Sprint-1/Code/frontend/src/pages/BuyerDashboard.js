import React, { useState, useEffect } from "react";
import BuyerSidebar from "../components/BuyerSidebar";
import Footer from "../components/Footer";

const BuyerDashboard = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Products");
  const [sortOption, setSortOption] = useState("None");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/product-listings");
        const data = await res.json();
        setFeaturedProducts(data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    const fetchFeaturedServices = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/service-listings");
        const data = await res.json();
        setFeaturedServices(data.data);
      } catch (error) {
        console.error("Error fetching featured services:", error);
      }
    };

    fetchFeaturedProducts();
    fetchFeaturedServices();
    handleSearchClick();
  }, []);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    handleSearchClick();
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value.trim()) {
      showSuggestions(event.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const showSuggestions = (query) => {
    let allItems = [];
    if (selectedFilter === "Products" || selectedFilter === "All") {
      allItems = allItems.concat(featuredProducts);
    }
    if (selectedFilter === "Services" || selectedFilter === "All") {
      allItems = allItems.concat(featuredServices);
    }

    const filteredSuggestions = allItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );

    setSuggestions(filteredSuggestions.slice(0, 4));
  };

  const sortItems = (items, option) => {
    if (option === "Price") {
      return items.sort((a, b) => {
        const aPrice = a.hasOwnProperty("price") ? a.price : a.rate;
        const bPrice = b.hasOwnProperty("price") ? b.price : b.rate;
        return aPrice - bPrice;
      });
    }

    if (option === "Date") {
      return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return items;
  };

  const handleSearchClick = () => {
    setSuggestions([]);
    let allItems = [];
    if (selectedFilter === "Products" || selectedFilter === "All") {
      allItems = allItems.concat(featuredProducts);
    }
    if (selectedFilter === "Services" || selectedFilter === "All") {
      allItems = allItems.concat(featuredServices);
    }

    const filteredItems = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredItems.length === 0) {
      setFilteredServices([]);
      setFilteredProducts([]);
    } else if (selectedFilter === "Products") {
      setFilteredProducts(sortItems(filteredItems, sortOption));
      setFilteredServices([]);
    } else if (selectedFilter === "Services") {
      setFilteredServices(sortItems(filteredItems, sortOption));
      setFilteredProducts([]);
    } else {
      const sortedItems = sortItems(filteredItems, sortOption);
      setFilteredProducts(sortedItems.filter((item) => item.hasOwnProperty("price")));
      setFilteredServices(sortedItems.filter((item) => item.hasOwnProperty("rate")));
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.title);
    if (item.hasOwnProperty("price")) {
      setSelectedFilter("Products");
      setFilteredProducts([item]);
      setFilteredServices([]);
    } else {
      setSelectedFilter("Services");
      setFilteredServices([item]);
      setFilteredProducts([]);
    }
    setSuggestions([]);
  };

  const renderContent = () => {
    let itemsToRender = [];

    if (!searchQuery) {
      if (selectedFilter === "Products") {
        itemsToRender = featuredProducts;
      } else if (selectedFilter === "Services") {
        itemsToRender = featuredServices;
      } else {
        itemsToRender = [...featuredProducts, ...featuredServices];
      }
    } else {
      if (selectedFilter === "Products") {
        itemsToRender = filteredProducts;
      } else if (selectedFilter === "Services") {
        itemsToRender = filteredServices;
      } else {
        itemsToRender = [...filteredProducts, ...filteredServices];
      }
    }

    itemsToRender = sortItems(itemsToRender, sortOption);

    if (itemsToRender.length === 0) {
      return <p className="text-center text-gray-700 mt-8">No products or services to show</p>;
    }

    return itemsToRender.map((item, index) => {
      if (item.hasOwnProperty("price")) {
        return (
          <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{item.title}</h2>
            <div className="h-40 bg-gray-300 mb-4">
              <img
                src={`${item.images?.[0]?.url || ""}`}
                alt={item.title}
                className="object-cover h-full w-full"
                style={{ aspectRatio: "16/9" }}
              />
            </div>
            <p className="text-lg font-semibold mb-4">${item.price}</p>
            <h5 className="text-lg font-semibold mb-4">{item.description}</h5>
            <div className="flex justify-between">
              <button className="bg-black text-white px-4 py-2 rounded">Buy Now</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">Learn More</button>
            </div>
          </div>
        );
      }

      return (
        <div key={index} className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">{item.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <p className="text-sm font-semibold mb-2">Category: {item.category}</p>
          <p className="text-sm font-semibold mb-2">City: {item.city}</p>
          <p className="text-lg font-semibold mb-4">
            {item.pricingModel}: ${item.rate}
          </p>
          <div className="flex justify-between">
            <button className="bg-black text-white px-4 py-2 rounded">Contact Now</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Learn More</button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex justify-between items-center p-4 bg-white shadow w-full">
        <div className="text-xl font-bold">Minar Market</div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-blue-500">About</a>
          <span className="text-gray-700 font-semibold">View</span>
          <select value={selectedFilter} onChange={handleFilterChange} className="border border-gray-300 p-2 rounded">
            <option>Products</option>
            <option>Services</option>
          </select>
          <span className="text-gray-700 font-semibold">Filters</span>
          <select value={sortOption} onChange={handleSortChange} className="border border-gray-300 p-2 rounded">
            <option>None</option>
            <option>Price</option>
            <option>Date</option>
          </select>
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 p-2 rounded w-64"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <div className="absolute bg-white shadow-lg mt-2 w-64">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          )}
          <button onClick={handleSearchClick} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            <a href="/buyer-requirement-form">List Requirement</a>
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded">Log out</button>
        </div>
      </nav>

      <div className="flex flex-1">
        <BuyerSidebar />
        <main className="flex-1 p-8">
          <div className="grid grid-cols-2 gap-6">{renderContent()}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BuyerDashboard;
