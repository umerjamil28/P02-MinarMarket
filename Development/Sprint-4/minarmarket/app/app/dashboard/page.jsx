"use client"

import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { getUserDetails } from "@/lib/SessionManager"
import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/data-grid"
import { useLocalStorage } from 'usehooks-ts'
import Link from "next/link"

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
import { ArrowLeft, Sparkles } from "lucide-react"
import { CategoryCarousel } from "@/components/category-carousel"

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

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState(null);

  // Listen for storage changes to update the type immediately
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'type') {
        setType(e.newValue || 'buyer');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setType]);
  
  // Also listen for the custom event from header
  useEffect(() => {
    const handleTypeChange = (e) => {
      setType(e.detail.type);
    };
    
    window.addEventListener('user-type-changed', handleTypeChange);
    
    return () => {
      window.removeEventListener('user-type-changed', handleTypeChange);
    };
  }, [setType]);

  const handleTypeChange = (newType) => {
    setType(newType)
    
    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("type", newType)
      
      // Dispatch a custom event to notify other components
      const event = new CustomEvent('user-type-changed', { 
        detail: { type: newType } 
      })
      window.dispatchEvent(event)
    }
  }

  const fetchRecommendedProducts = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/recommendedproducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendedProducts(data.data);
      } else {
        setErrorRecommended(data.message || "Failed to fetch recommended products.");
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error);
      setErrorRecommended("An error occurred while fetching recommended products.");
    } finally {
      setLoadingRecommended(false);
    }
  };

  useEffect(() => {
    fetchRecommendedProducts();
  }, [userId]);



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

  // Get colors based on type
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014"
  const secondaryColor = type === "buyer" ? "#9F5AE5" : "#FF9D4D"
  const lightBgClass = type === "buyer" ? "from-violet-50 to-white" : "from-orange-50 to-white"
  const accentBgClass = type === "buyer" ? "bg-violet-100" : "bg-orange-100"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgClass} overflow-x-hidden`}>
      <Header />
      <div className="container max-w-full px-4 mx-auto flex-1 items-start md:grid md:grid-cols-[250px_1fr] md:gap-8 md:py-8">
        <SidebarNav />
        <main className="flex w-full flex-col gap-8 p-4 md:p-0 overflow-hidden">
          {/* Show Categories Only When No Category Is Selected */}
          {!selectedCategory ? (
            <>
            

              {/* Welcome Section */}
              <section >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  <span className="text-[#872CE4]" style={{ color: primaryColor }}>
                    {type === "buyer" ? "Buyer" : "Seller"}
                  </span>{" "}
                  Dashboard
                </h1>
                            {type === "buyer" && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => window.location.href = "/app/buyer/search-by-image"}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200"
                >
                  🔍 Search by Image
                </button>
              </div>
            )}
                
                {/* <div
                  className="h-1 w-20 bg-gradient-to-r rounded-full mt-4"
                  style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                ></div> */}
              </section>
              
              






              {/* Product Categories */}
              <section>
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">Product Categories</h2>
                  <div
                    className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                    style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                  ></div>
                  {/* <Sparkles className="ml-2 h-5 w-5" style={{ color: primaryColor }} /> */}
                </div>
                
                {/* Replace the grid with the carousel */}
                <CategoryCarousel 
                  categories={productCategories} 
                  onCategoryClick={(category) => handleCategoryClick(category, "product")}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </section>

              {/* Service Categories */}
              <section>
                <div className="flex items-center mb-8 mt-12">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">Service Categories</h2>
                  <div
                    className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                    style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                  ></div>
                  {/* <Sparkles className="ml-2 h-5 w-5" style={{ color: primaryColor }} /> */}
                </div>
                
                {/* Replace the grid with the carousel */}
                <CategoryCarousel 
                  categories={serviceCategories} 
                  onCategoryClick={(category) => handleCategoryClick(category, "service")}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </section>


              {/* Display Recommended Products */}
              {type === "buyer" && (
                <section className="pb-12">
                  <div className="flex items-center mb-8 mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mr-3">Top Product Picks For You</h2>
                    <div
                      className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                      style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                    ></div>
                    <Sparkles className="ml-2 h-5 w-5" style={{ color: primaryColor }} />
                  </div>

                  {loadingRecommended ? (
                    <p>Loading...</p>
                  ) : errorRecommended ? (
                    <p className="text-red-500">{errorRecommended}</p>
                  ) : recommendedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {recommendedProducts.map((product) => (
                        <Link href={`/app/individual-product/${product._id}`} key={product._id} className="block">
                        <div className="border rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-200 hover:scale-[1.01]">
                          <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="w-full h-40 object-cover rounded-xl mb-4"
                          />
                          <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                        </div>
                      </Link>
                      
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No recommended products found.</p>
                  )}
                </section>
                )}

              {/* Default Product Grid */}
              <section className="pb-12">
                <div className="flex items-center mb-8 mt-12">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">
                    {type === "buyer" ? "Recent Listings" : "Recent Listings"}
                  </h2>
                  <div
                    className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                    style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                  ></div>
                  {/* <Sparkles className="ml-2 h-5 w-5" style={{ color: primaryColor }} /> */}
                </div>
                <ProductGrid userId={userId} />
              </section>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                className="mb-8 px-6 py-2 rounded-full border shadow-sm flex items-center gap-2 transition-all duration-300 text-white hover:scale-105"
                onClick={handleBackClick}
                style={{ backgroundColor: primaryColor }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </button>

              {/* Selected Category Items */}
              <section className="pb-12">
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mr-3">
                    {categoryType === "product" ? "Products" : "Services"} in {selectedCategory}
                  </h2>
                  <div
                    className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                    style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                  ></div>
                  <Sparkles className="ml-2 h-5 w-5" style={{ color: primaryColor }} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
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
                    <p className="text-center col-span-full text-gray-500 bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-violet-100 shadow-sm">
                      No {categoryType === "product" ? "products" : "services"} found for {selectedCategory}.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      {/* Add blob animations similar to home page */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full blur-3xl animate-blob opacity-[0.03]"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-[0.03]"
          style={{ backgroundColor: secondaryColor }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full blur-3xl animate-blob animation-delay-4000 opacity-[0.03]"
          style={{ backgroundColor: type === "buyer" ? "rgb(216, 180, 254)" : "rgb(255, 207, 159)" }}
        ></div>
      </div>

      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}


