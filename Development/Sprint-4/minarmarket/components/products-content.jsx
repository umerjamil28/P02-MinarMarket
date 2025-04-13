"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaLaptop, FaTshirt, FaBook, FaShoePrints, FaCouch, FaPumpSoap, FaGamepad, FaBox } from "react-icons/fa"
import { ProductCard } from "@/components/product-card"
import { ArrowLeft, ArrowDownUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { ProductOnlyGrid } from "@/components/data-grid"
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

export function ProductsContent({ userId, type = "buyer" }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryItems, setCategoryItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("recent")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const fetchProductsByCategory = async (category) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-category/${category}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch category products. Status: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.data) {
        setCategoryItems(data.data)
      } else {
        setCategoryItems([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(error.message)
      setCategoryItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    fetchProductsByCategory(category)
  }

  const handleBackClick = () => {
    setSelectedCategory(null)
    setCategoryItems([])
  }

  // Get colors based on type
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014"
  const secondaryColor = type === "buyer" ? "#9F5AE5" : "#FF9D4D"

  // Filter products by search query
  const filteredItems = searchQuery
    ? categoryItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categoryItems

  // Sort products
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    } else {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    }
  })

  return (
    <motion.main
      className="flex w-full flex-col gap-8 px-4" // Adjusted padding
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div  className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
          </div>
        </div>
        <div
          className="h-1 w-20 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
        ></div>
      </motion.div>

      {/* Show Categories Only When No Category Is Selected */}
      {!selectedCategory ? (
        <>
          {/* Product Categories */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mr-3">Product Categories</h2>
              <div
                className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
              ></div>
            </div>
            
            {/* Replace the grid with the carousel */}
            <CategoryCarousel 
              categories={productCategories} 
              onCategoryClick={handleCategoryClick}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </motion.section>

          {/* Products Only Grid */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mr-3">Featured Products</h2>
              <div
                className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
              ></div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
              <ProductOnlyGrid userId={userId} />
            </div>
          </motion.section>
        </>
      ) : (
        <>
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Button
              className="mb-6 px-6 py-2 rounded-full border shadow-sm flex items-center gap-2 transition-all duration-300 text-white hover:scale-105"
              onClick={handleBackClick}
              style={{ backgroundColor: primaryColor }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-5 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <SearchBar 
                  className="w-full" 
                  onSearch={(value) => setSearchQuery(value)}
                />
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-gray-500" />
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                    style={{
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      focusRing: primaryColor,
                    }}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selected Category Items */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mr-3">Products in {selectedCategory}</h2>
              <div
                className="h-px flex-grow bg-gradient-to-r opacity-30 rounded-full"
                style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
              ></div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
                  style={{ borderColor: primaryColor }}
                ></div>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                <p className="text-red-500 mb-4">Error loading products: {error}</p>
                <Button
                  onClick={() => fetchProductsByCategory(selectedCategory)}
                  className="px-6 py-2 text-white rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {sortedItems && sortedItems.length > 0 ? (
                  sortedItems.map((item, index) => (
                    <motion.div key={item._id || index} variants={itemVariants} className="h-full flex">
                      <ProductCard
                        _id={item._id}
                        title={item.title}
                        images={item.images || ""}
                        price={item.price}
                        category={item.category}
                        status={item.status}
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center col-span-full py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 text-gray-500">
                    No products found for {selectedCategory}.
                  </p>
                )}
              </motion.div>
            )}
          </motion.section>
        </>
      )}
    </motion.main>
  )
}