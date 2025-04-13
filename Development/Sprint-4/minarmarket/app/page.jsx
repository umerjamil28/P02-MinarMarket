"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic' // Import dynamic
import { Button } from "@/components/ui/button"
// Dynamically import components
const SiteHeader = dynamic(() => import('@/components/site-header').then(mod => mod.SiteHeader))
const SiteFooter = dynamic(() => import('@/components/site-footer').then(mod => mod.SiteFooter))
const LandingPageProductGrid = dynamic(() => import('@/components/data-grid').then(mod => mod.LandingPageProductGrid))
const ProductCard = dynamic(() => import('@/components/product-card').then(mod => mod.ProductCard))
const ServiceCard = dynamic(() => import('@/components/product-card').then(mod => mod.ServiceCard))

import {
  FaLaptop,
  FaGamepad,
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
  FaTshirt,
  FaBook,
  FaShoePrints,
  FaCouch,
  FaPumpSoap,
  FaBox,
} from "react-icons/fa"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter
import { getUserDetails } from "@/lib/SessionManager" // Import getUserDetails

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryItems, setCategoryItems] = useState([])
  const [categoryType, setCategoryType] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state
  const router = useRouter() // Get router instance

  // Redirect logged-in users to dashboard or finish loading
  useEffect(() => {
    const user = getUserDetails()
    if (user) {
      router.push("/app/dashboard")
    } else {
      setLoading(false) // User is not logged in, finish loading
    }
  }, [router]) // Dependency array includes router

  const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token")
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        userId = payload.id
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,
          page: 2,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
    } catch (error) {
      console.error("Error recording visit:", error)
    }
  }

  // Record visit only after loading is complete and user is not logged in
  useEffect(() => {
    if (!loading) {
      recordVisit()
    }
  }, [loading]) // Depend on loading state

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-category-landing-page/${category}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      )
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-category-landing-page/${category}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      )
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

  // Render nothing while loading/redirecting
  if (loading) {
    return null // Or a loading spinner component
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main>
        {!selectedCategory ? (
          <>
            {/* Hero Section with Animated Background */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-orange-50">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#872CE4] rounded-full blur-3xl animate-blob"></div>
                  <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#F58014] rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-violet-300 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
                    Find the Items and Services You Need
                  </h1>
                  <p className="text-xl text-[#7B7A7E] max-w-2xl mx-auto">
                    Browse through our diverse range of products and services that fit your needs.
                  </p>
                  <Button
                    size="lg"
                    className="bg-[#872CE4] hover:bg-[#872CE4]/90 text-white px-8 py-6 text-lg rounded-full"
                    asChild
                  >
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Product Categories */}
            <section className="py-20 container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12">Product Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productCategories.map((category, index) => {
                  // Use theme colors instead of random colors
                  const colors = [
                    "bg-violet-600",
                    "bg-violet-500",
                    "bg-orange-500",
                    "bg-orange-400",
                    "bg-violet-700",
                    "bg-violet-400",
                    "bg-orange-600",
                    "bg-orange-300",
                  ]
                  const color = colors[index % colors.length]

                  // Determine grid span based on index for varied sizes, but ensure responsive behavior
                  let colSpan = ""

                  // Special handling for last two items to fill width on larger screens
                  if (index === productCategories.length - 2) {
                    colSpan = "sm:col-span-1 md:col-span-2 lg:col-span-2"
                  } else if (index === productCategories.length - 1) {
                    colSpan = "sm:col-span-2 md:col-span-1 lg:col-span-2"
                  } else if (index % 5 === 0) {
                    colSpan = "sm:col-span-2 md:col-span-2"
                  } else if (index % 7 === 0) {
                    colSpan = "sm:col-span-2 md:col-span-1"
                  }

                  return (
                    <div
                      key={index}
                      onClick={() => handleCategoryClick(category.name, "product")}
                      className={`${color} ${colSpan} rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
                    >
                      <div className="h-full p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-5xl text-white/90">{category.icon}</div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold text-white text-center">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Service Categories */}
            <section className="py-20 container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12">Service Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {serviceCategories.map((category, index) => {
                  // Use theme colors instead of random colors
                  const colors = [
                    "bg-violet-500",
                    "bg-orange-500",
                    "bg-violet-600",
                    "bg-orange-400",
                    "bg-violet-400",
                    "bg-orange-600",
                    "bg-violet-700",
                    "bg-orange-300",
                    "bg-violet-300",
                    "bg-orange-700",
                  ]
                  const color = colors[index % colors.length]

                  // Determine grid span based on index for varied sizes, but ensure responsive behavior
                  let colSpan = ""

                  // Special handling for last items to fill width on larger screens
                  if (index === serviceCategories.length - 3) {
                    colSpan = "sm:col-span-2 md:col-span-1"
                  } else if (index === serviceCategories.length - 2) {
                    colSpan = "sm:col-span-1 md:col-span-1 lg:col-span-2"
                  } else if (index === serviceCategories.length - 1) {
                    colSpan = "sm:col-span-1 md:col-span-1 lg:col-span-2"
                  } else if (index % 4 === 0) {
                    colSpan = "sm:col-span-2 md:col-span-2"
                  } else if (index % 6 === 0) {
                    colSpan = "sm:col-span-2 md:col-span-1"
                  }

                  return (
                    <div
                      key={index}
                      onClick={() => handleCategoryClick(category.name, "service")}
                      className={`${color} ${colSpan} rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
                    >
                      <div className="h-full p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-5xl text-white/90">{category.icon}</div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold text-white text-center">{category.name}</h3>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Featured Items */}
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12">Featured Items</h2>
                <LandingPageProductGrid />
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
            {/* Back Button */}
            <button
              onClick={handleBackClick}
              className="mb-12 flex items-center gap-2 text-[#7B7A7E] hover:text-[#872CE4] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </button>

            {/* Selected Category Items */}
            <section>
              <h2 className="text-2xl font-semibold text-[#000000] mb-8">
                {categoryType === "product" ? "Products" : "Services"} in {selectedCategory}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                  <p className="col-span-full text-center py-12 text-[#7B7A7E]">
                    No {categoryType === "product" ? "products" : "services"} found in {selectedCategory}.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <SiteFooter />

      <style jsx global>{`
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

