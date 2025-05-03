"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { RequirementList } from "@/components/data-list"
import { useLocalStorage } from 'usehooks-ts'
import Link from "next/link"
import { motion } from "framer-motion"
import { PlusCircle, Filter, ArrowDownUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"

export default function MyProductPage() {
  const [type] = useLocalStorage("type", "buyer")
  const [mounted, setMounted] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Get colors based on type
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014"
  const lightBgClass = type === "buyer" ? "from-violet-50 to-white" : "from-orange-50 to-white"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgClass}`}>
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[250px_1fr] md:gap-8 md:py-8">
        <SidebarNav />
        <motion.main
          className="flex w-full flex-col gap-8 p-4 md:p-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Product Requirements</h1>
              <Button
                className="rounded-full px-6 text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
                asChild
              >
                <Link href="/app/buyer/list-product">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List Requirement
                </Link>
              </Button>
            </div>
            <div
              className="h-1 w-20 rounded-full"
              style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
            ></div>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <SearchBar 
                  className="w-full" 
                  onSearch={(value) => setSearchQuery(value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <div className="flex bg-gray-100 p-1 rounded-full">
                    {["all", "pending", "approved"].map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          filterStatus === status ? "text-white" : "text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{
                          backgroundColor: filterStatus === status ? primaryColor : "transparent",
                        }}
                        onClick={() => setFilterStatus(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
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
            </div>
          </motion.div>

          {/* Requirements List */}
          <motion.div
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <RequirementList
              initialFilterStatus={filterStatus}
              initialSortOrder={sortOrder}
              searchQuery={searchQuery}
            />
          </motion.div>
        </motion.main>
      </div>

      {/* Add blob animations similar to dashboard page */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob opacity-[0.03]"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-[0.03]"
          style={{ backgroundColor: type === "buyer" ? "#9F5AE5" : "#FF9D4D" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-4000 opacity-[0.03]"
          style={{ backgroundColor: type === "buyer" ? "rgb(216, 180, 254)" : "rgb(255, 207, 159)" }}
        ></div>
      </div>

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
