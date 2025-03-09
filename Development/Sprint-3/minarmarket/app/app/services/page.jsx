"use client";

import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { MainNav } from "@/components/main-nav";
import { getUserDetails } from "@/lib/SessionManager";
import { useState } from "react";
import { useEffect } from "react";
import { ServiceOnlyGrid } from "@/components/data-grid";
import {
  FaCut, FaWrench, FaHammer, FaBolt, FaLeaf, FaUtensils, FaBroom, FaCode, FaPaintBrush, FaTools
} from "react-icons/fa";
import { ServiceCard } from "@/components/product-card";

const serviceCategories = [
  { name: "Haircut", icon: <FaCut /> },
  { name: "Plumbing", icon: <FaWrench /> },
  { name: "Carpentry", icon: <FaHammer /> },
  { name: "Electrical", icon: <FaBolt /> },
  { name: "Gardening", icon: <FaLeaf /> },
  { name: "Catering", icon: <FaUtensils /> },
  { name: "House Help", icon: <FaBroom /> },
  { name: "Web Development", icon: <FaCode /> },
  { name: "Design", icon: <FaPaintBrush /> },
  { name: "Other", icon: <FaTools /> },
];

export default function ServicesPage() {
  const [userDetails, setUserDetails] = useState(getUserDetails());
  const userId = userDetails?.userId || null;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token") 
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        userId = payload.id; // Extract userId from JWT
      
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,
          page: 5, 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("Visit recorded successfully:", data);
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  };

  // ✅ Call recordVisit when the page loads
  useEffect(() => {
    recordVisit();
  }, []);


  const fetchServicesByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching services for category: ${category}`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-category/${category}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch category services. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Category services fetched:", data);
      
      if (data && data.data) {
        setCategoryItems(data.data);
      } else {
        console.warn("No category data returned from API:", data);
        setCategoryItems([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error.message);
      setCategoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchServicesByCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setCategoryItems([]);
  };

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex w-full flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Services</h1>
            <MainNav />
          </div>

          {/* Show Categories Only When No Category Is Selected */}
          {!selectedCategory ? (
            <>
              {/* Service Categories */}
              <section>
                <h2 className="mb-6 text-2xl font-bold">Service Categories</h2>
                <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-8">
                  {serviceCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground cursor-pointer hover:bg-gray-200"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="relative flex items-center justify-center w-16 h-16 text-5xl text-gray-700">
                        {category.icon}
                      </div>
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Services Only Grid */}
              <ServiceOnlyGrid userId={userId} />
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                className="mb-4 px-4 py-2 bg-gray-300 rounded-md w-fit hover:bg-gray-400"
                onClick={handleBackClick}
              >
                ← Back to Categories
              </button>

              {/* Selected Category Items */}
              <section>
                <h2 className="mb-6 text-2xl font-bold">
                  Services in {selectedCategory}
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading services: {error}</p>
                    <button 
                      onClick={() => fetchServicesByCategory(selectedCategory)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {categoryItems && categoryItems.length > 0 ? (
                      categoryItems.map((item, index) => (
                        <ServiceCard
                          key={item._id || index}
                          _id={item._id}
                          title={item.title}
                          images={item.images || ""}
                          rate={item.rate}
                          category={item.category}
                          pricingModel={item.pricingModel}
                          status={item.status}
                        />
                      ))
                    ) : (
                      <p className="text-center col-span-full">
                        No services found for {selectedCategory}.
                      </p>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

