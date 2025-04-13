"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ServiceList } from "@/components/data-list"
import { useLocalStorage } from 'usehooks-ts'
import Link from "next/link"
import { Search, Filter, ChevronDown } from "lucide-react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"

export default function MyServicesPage() {
  const [type] = useLocalStorage("type", "seller")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Get colors based on type (seller uses orange)
  const primaryColor = "#F58014"
  const lightBgClass = "from-orange-50 to-white"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgClass}`}>
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[250px_1fr] md:gap-8 md:py-8">
        <SidebarNav />
        <main className="flex w-full flex-col gap-8 p-4 md:p-0">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">My Services</h1>
              <Button
                className="rounded-full px-6 text-white transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
                asChild
              >
                <Link href="/app/seller/list-service">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  List Service
                </Link>
              </Button>
            </div>
            <div
              className="h-1 w-20 rounded-full"
              style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)` }}
            ></div>
          </div>

          {/* Filter Section - Matching the buyer UI */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <SearchBar 
                  className="w-full" 
                  onSearch={(value) => setSearchQuery(value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Filter Button */}
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
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

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    <span>{sortOrder === "recent" ? "Most Recent" : "Oldest First"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                      <div className="py-1">
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${
                            sortOrder === "recent" ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            setSortOrder("recent")
                            setShowSortDropdown(false)
                          }}
                        >
                          Most Recent
                        </button>
                        <button
                          className={`w-full text-left px-4 py-2 text-sm ${
                            sortOrder === "oldest" ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            setSortOrder("oldest")
                            setShowSortDropdown(false)
                          }}
                        >
                          Oldest First
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm p-6">
            <ServiceList initialFilterStatus={filterStatus} initialSortOrder={sortOrder} searchQuery={searchQuery} />
          </div>
        </main>
      </div>

      {/* Add blob animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob opacity-[0.03]"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-[0.03]"
          style={{ backgroundColor: "#FF9D4D" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-4000 opacity-[0.03]"
          style={{ backgroundColor: "rgb(255, 207, 159)" }}
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
