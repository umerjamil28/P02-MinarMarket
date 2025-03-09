"use client"

import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { getUserDetails } from "@/lib/SessionManager"
import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/data-grid"
import {
  FaLaptop,
  FaTshirt,
  FaBook,
  FaShoePrints,
  FaCouch,
  FaPumpSoap,
  FaGamepad,
  FaBox,
  FaCut,
  FaWrench,
  FaHammer,
  FaBolt,
  FaLeaf,
  FaUtensils,
  FaBroom,
  FaCode,
  FaPaintBrush,
  FaTools,
} from "react-icons/fa"
import { ServiceCard } from "@/components/product-card"
import { ProductCard } from "@/components/product-card"
import { useLocalStorage } from "@uidotdev/usehooks"
import { ArrowLeft } from "lucide-react"


const productCategories = [
  { name: "Electronics", icon: <FaLaptop /> },
  { name: "Clothing", icon: <FaTshirt /> },
  { name: "Books", icon: <FaBook /> },
  { name: "Footwear", icon: <FaShoePrints /> },
  { name: "Furniture", icon: <FaCouch /> },
  { name: "Beauty and Personal Care", icon: <FaPumpSoap /> },
  { name: "Toys", icon: <FaGamepad /> },
  { name: "Other", icon: <FaBox /> },
]

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
]

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState(getUserDetails())
  const userId = userDetails?.userId || null
  const [type, setType] = useLocalStorage("type", "buyer")

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryItems, setCategoryItems] = useState([])
  const [categoryType, setCategoryType] = useState(null)

  
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
          page: 1, 
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

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-category/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setCategoryItems(data.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setCategoryItems([])
    }
  }

  const fetchServicesByCategory = async (category) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-category/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error("Failed to fetch services")
      const data = await response.json()
      setCategoryItems(data.data || [])
    } catch (error) {
      console.error("Error fetching services:", error)
      setCategoryItems([])
    }
  }

  const handleCategoryClick = (category, type) => {
    setSelectedCategory(category)
    setCategoryType(type)
    type === "product" ? fetchProductsByCategory(category) : fetchServicesByCategory(category)
  }

  const handleBackClick = () => {
    setSelectedCategory(null)
    setCategoryItems([])
    setCategoryType(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:py-8">
        <SidebarNav />
        <main className="flex w-full flex-col gap-8 p-4 md:p-0">
          {/* Show Categories Only When No Category Is Selected */}
          {!selectedCategory ? (
            <>
              {/* Welcome Section */}
              <section
                className={`rounded-lg border p-6 shadow-sm bg-white ${
                  type === "buyer" ? "border-gray-200" : "border-gray-200"
                }`}
              >
                <h1 className={`text-2xl font-bold mb-2 ${type === "buyer" ? "text-gray-800" : "text-gray-800"}`}>
                  Welcome to your {type === "buyer" ? "Buyer" : "Seller"} Dashboard
                </h1>
                <p className="text-gray-600">
                  {type === "buyer"
                    ? "Browse categories to find what you need or post your requirements."
                    : "Manage your listings and respond to buyer requirements."}
                </p>
              </section>

              {/* Product Categories */}
              <section>
                <h2 className={`mb-6 text-2xl font-bold ${type === "buyer" ? "text-gray-800" : "text-gray-800"}`}>
                  Product Categories
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                  {productCategories.map((category, index) => (
                    <div
                      key={index}
                      className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-lg border bg-white shadow-sm hover:shadow cursor-pointer transition-all duration-300 ${
                        type === "buyer"
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleCategoryClick(category.name, "product")}
                    >
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 text-3xl ${
                          type === "buyer" ? "text-gray-700" : "text-gray-700"
                        }`}
                      >
                        {category.icon}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Service Categories */}
              <section>
                <h2 className={`mb-6 text-2xl font-bold ${type === "buyer" ? "text-gray-800" : "text-gray-800"}`}>
                  Service Categories
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                  {serviceCategories.map((category, index) => (
                    <div
                      key={index}
                      className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-lg border bg-white shadow-sm hover:shadow cursor-pointer transition-all duration-300 ${
                        type === "buyer"
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleCategoryClick(category.name, "service")}
                    >
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 text-3xl ${
                          type === "buyer" ? "text-gray-700" : "text-gray-700"
                        }`}
                      >
                        {category.icon}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Default Product Grid */}
              <section>
                <h2 className={`mb-6 text-2xl font-bold ${type === "buyer" ? "text-gray-800" : "text-gray-800"}`}>
                  {type === "buyer" ? "Recent Listings" : "Your Listings"}
                </h2>
                <ProductGrid userId={userId} />
              </section>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                className="mb-8 px-6 py-2 rounded-lg border bg-white shadow-sm flex items-center gap-2 transition-colors hover:bg-gray-50 text-gray-700 border-gray-200"
                onClick={handleBackClick}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </button>

              {/* Selected Category Items */}
              <section>
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                  {categoryType === "product" ? "Products" : "Services"} in {selectedCategory}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryItems.length > 0 ? (
                    categoryItems.map((item, index) =>
                      categoryType === "product" ? (
                        <ProductCard
                          key={item.id || index}
                          _id={item._id}
                          title={item.title}
                          images={item.images || ""}
                          price={item.price}
                          category={item.category}
                          status={item.status}
                        />
                      ) : (
                        <ServiceCard
                          key={item.id || index}
                          _id={item._id}
                          title={item.title}
                          images={item.images || ""}
                          rate={item.rate}
                          category={item.category}
                          pricingModel={item.pricingModel}
                          status={item.status}
                        />
                      ),
                    )
                  ) : (
                    <p className="text-center col-span-full text-gray-500 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                      No {categoryType === "product" ? "products" : "services"} found for {selectedCategory}.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

