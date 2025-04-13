"use client"
import { ProductCard, ServiceCard } from "@/components/product-card-list"
import { showMyProductListings, showMyRequirement } from "@/lib/api/product"
import { showMyServiceListings } from "@/lib/api/service"
import { getUserDetails } from "@/lib/SessionManager"
import { useQuery } from "@tanstack/react-query"
import { getMyServiceRequirements } from "@/lib/api/service"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLocalStorage } from 'usehooks-ts'
import { motion } from "framer-motion"

export function AdminProductsList() {}

// Reusable pagination component with enhanced styling
function EnhancedPagination({ currentPage, totalPages, setCurrentPage, type }) {
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014"

  return totalPages > 1 ? (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          // Show pages around current page
          let pageNum
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
            <button
              key={i}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                currentPage === pageNum ? "text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: currentPage === pageNum ? primaryColor : "transparent",
              }}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      <button
        className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-100"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  ) : null
}

export function ProductList({ initialFilterStatus = "all", initialSortOrder = "recent", searchQuery = "" }) {
  const userDetails = getUserDetails()
  const userId = userDetails?.userId
  const [type] = useLocalStorage("type", "seller")

  const { data: products } = useQuery({
    queryKey: ["product", userId],
    queryFn: () => showMyProductListings(userId),
    enabled: !!userId,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus)
  const itemsPerPage = 5

  // Update state when props change
  useEffect(() => {
    setFilterStatus(initialFilterStatus)
    setSortOrder(initialSortOrder)
    setCurrentPage(1) // Reset to first page when filters change
  }, [initialFilterStatus, initialSortOrder, searchQuery])

  // Get product list and apply sorting and filtering
  let productList = products?.data || []

  // Apply search filtering if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    productList = productList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)),
    )
  }

  // Apply status filtering if not "all"
  if (filterStatus !== "all") {
    // Map UI filter values to actual status values in the data
    const statusMap = {
      pending: "pending",
      approved: "active", // Assuming "approved" in UI maps to "active" in data
    }

    const targetStatus = statusMap[filterStatus] || filterStatus
    productList = productList.filter((item) => item.status?.toLowerCase() === targetStatus.toLowerCase())
  }

  // Apply sorting
  productList = [...productList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt) // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
    }
  })

  // Pagination
  const totalPages = Math.ceil(productList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = productList.slice(startIndex, startIndex + itemsPerPage)

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="space-y-4">
      {/* Product List with animations */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <motion.div key={product.id || product._id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100"
          >
            <p className="text-gray-500">No products found with the selected filter.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Pagination Controls */}
      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        type={type}
      />
    </div>
  )
}

export function RequirementList({ initialFilterStatus = "all", initialSortOrder = "recent", searchQuery = "" }) {
  const userDetails = getUserDetails()
  const userId = userDetails?.userId
  const [type] = useLocalStorage("type", "buyer")

  const {
    data: products,
    isError,
    error,
  } = useQuery({
    queryKey: ["requirement", userId],
    queryFn: async () => await showMyRequirement(userId),
    enabled: !!userId,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus)
  const itemsPerPage = 5

  // Update state when props change
  useEffect(() => {
    setFilterStatus(initialFilterStatus)
    setSortOrder(initialSortOrder)
    setCurrentPage(1) // Reset to first page when filters change
  }, [initialFilterStatus, initialSortOrder, searchQuery])

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  // Get requirement list and apply sorting and filtering
  let requirementList = products?.data || []

  // Apply search filtering if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    requirementList = requirementList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)),
    )
  }

  // Apply status filtering if not "all"
  if (filterStatus !== "all") {
    // Map UI filter values to actual status values in the data
    const statusMap = {
      pending: "pending",
      approved: "approved",
    }

    const targetStatus = statusMap[filterStatus] || filterStatus
    requirementList = requirementList.filter((item) => item.status?.toLowerCase() === targetStatus.toLowerCase())
  }

  // Apply sorting
  requirementList = [...requirementList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt) // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
    }
  })

  // Pagination
  const totalPages = Math.ceil(requirementList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequirements = requirementList.slice(startIndex, startIndex + itemsPerPage)

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="space-y-4">
      {/* Requirement List with animations */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {paginatedRequirements.length > 0 ? (
          paginatedRequirements.map((product) => (
            <motion.div key={product.id || product._id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100"
          >
            <p className="text-gray-500">No requirements found with the selected filter.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Pagination Controls */}
      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        type={type}
      />
    </div>
  )
}

export function ServiceList({ initialFilterStatus = "all", initialSortOrder = "recent", searchQuery = "" }) {
  const userDetails = getUserDetails()
  const userId = userDetails?.userId
  const [type] = useLocalStorage("type", "seller")

  const { data: services } = useQuery({
    queryKey: ["service", userId],
    queryFn: () => showMyServiceListings(userId),
    enabled: !!userId,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus)
  const itemsPerPage = 5

  // Update state when props change
  useEffect(() => {
    setFilterStatus(initialFilterStatus)
    setSortOrder(initialSortOrder)
    setCurrentPage(1) // Reset to first page when filters change
  }, [initialFilterStatus, initialSortOrder, searchQuery])

  // Get service list and apply sorting and filtering
  let serviceList = services?.data || []

  // Apply search filtering if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    serviceList = serviceList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)),
    )
  }

  // Apply status filtering if not "all"
  if (filterStatus !== "all") {
    // Map UI filter values to actual status values in the data
    const statusMap = {
      pending: "pending",
      approved: "active", // Assuming "approved" in UI maps to "active" in data
    }

    const targetStatus = statusMap[filterStatus] || filterStatus
    serviceList = serviceList.filter((item) => item.status?.toLowerCase() === targetStatus.toLowerCase())
  }

  // Apply sorting
  serviceList = [...serviceList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt) // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
    }
  })

  // Pagination
  const totalPages = Math.ceil(serviceList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = serviceList.slice(startIndex, startIndex + itemsPerPage)

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="space-y-4">
      {/* Service List with animations */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {paginatedServices.length > 0 ? (
          paginatedServices.map((service) => (
            <motion.div key={service.id || service._id} variants={itemVariants}>
              <ServiceCard {...service} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100"
          >
            <p className="text-gray-500">No services found with the selected filter.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Pagination Controls */}
      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        type={type}
      />
    </div>
  )
}

export function ServiceRequirementList({ initialFilterStatus = "all", initialSortOrder = "recent", searchQuery = "" }) {
  const userDetails = getUserDetails()
  const userId = userDetails?.userId
  const [type] = useLocalStorage("type", "buyer")

  const { data: services } = useQuery({
    queryKey: ["serviceRequirements", userId],
    queryFn: () => getMyServiceRequirements(userId),
    enabled: !!userId,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus)
  const itemsPerPage = 5

  // Update state when props change
  useEffect(() => {
    setFilterStatus(initialFilterStatus)
    setSortOrder(initialSortOrder)
    setCurrentPage(1) // Reset to first page when filters change
  }, [initialFilterStatus, initialSortOrder, searchQuery])

  // Get service requirement list and apply sorting and filtering
  let serviceList = services?.data || []

  // Apply search filtering if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    serviceList = serviceList.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)),
    )
  }

  // Apply status filtering if not "all"
  if (filterStatus !== "all") {
    // Map UI filter values to actual status values in the data
    const statusMap = {
      pending: "pending",
      approved: "approved",
    }

    const targetStatus = statusMap[filterStatus] || filterStatus
    serviceList = serviceList.filter((item) => item.status?.toLowerCase() === targetStatus.toLowerCase())
  }

  // Apply sorting
  serviceList = [...serviceList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt) // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
    }
  })

  // Pagination
  const totalPages = Math.ceil(serviceList.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = serviceList.slice(startIndex, startIndex + itemsPerPage)

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <div className="space-y-4">
      {/* Service Requirement List with animations */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {paginatedServices.length > 0 ? (
          paginatedServices.map((service) => (
            <motion.div key={service._id || service.id} variants={itemVariants}>
              <ServiceCard {...service} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100"
          >
            <p className="text-gray-500">No service requirements found with the selected filter.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Pagination Controls */}
      <EnhancedPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        type={type}
      />
    </div>
  )
}
