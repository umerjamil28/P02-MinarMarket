
"use client";
import { useState } from "react";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { BuyerProductCard } from "@/components/buyer-requirement-card";
import { useQuery } from "@tanstack/react-query";
import { getBuyerRequirements } from "@/lib/api/buyer-requirement";
import { getUserDetails } from "@/lib/SessionManager";

export default function BuyerRequirementsPage() {
  const user = getUserDetails();

  const { data: requirements, isLoading, error } = useQuery({
    queryKey: ["buyer-requirements"],
    queryFn: () => getBuyerRequirements(),
    enabled: !!user?.userId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // Default: Most Recent
  const itemsPerPage = 6;

  // Get requirements and apply sorting
  let requirementList = requirements?.data || [];

  requirementList = [...requirementList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
    }
  });

  // Pagination
  const totalPages = Math.ceil(requirementList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequirements = requirementList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Buyer Product Requirements</h1>

            {/* Sorting Dropdown */}
            <div className="flex items-center">
              <label className="mr-2 font-medium">Sort By:</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1); // Reset to first page on sort change
                }}
                className="px-3 py-1 border rounded-md"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {isLoading && <div>Loading requirements...</div>}
          {error && <div>Error: {error.message}</div>}

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRequirements.map((requirement) => (
              <BuyerProductCard key={requirement._id} {...requirement} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span className="px-4 py-2">{currentPage} / {totalPages}</span>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
