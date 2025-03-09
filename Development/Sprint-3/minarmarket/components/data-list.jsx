"use client";
import { ProductCard, ServiceCard } from "@/components/product-card-list"
import { showMyProductListings, showMyRequirement } from "@/lib/api/product"
import { showMyServiceListings } from "@/lib/api/service";
import { getUserDetails } from "@/lib/SessionManager";
import { useQuery } from "@tanstack/react-query";
import { getMyServiceRequirements } from "@/lib/api/service";
import { useState } from "react";

export function AdminProductsList() {
  
}


export function ProductList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data: products } = useQuery({
    queryKey: ["product"],
    queryFn: () => showMyProductListings(userId),
    enabled: !!userId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // Default: Most Recent
  const itemsPerPage = 5;

  // Get product list and apply sorting
  let productList = products?.data || [];
  
  productList = [...productList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
    }
  });

  // Pagination
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = productList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-4">
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

      {/* Product List */}
      {paginatedProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
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
    </div>
  );
}


export function RequirementList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data: products, isError, error } = useQuery({
    queryKey: ["requirement", userId],
    queryFn: async () => await showMyRequirement(userId),
    enabled: !!userId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // Default: Most Recent
  const itemsPerPage = 5;

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Get requirement list and apply sorting
  let requirementList = products?.data || [];

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
    <div className="space-y-4">
      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-4">
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

      {/* Requirement List */}
      {paginatedRequirements.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
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
    </div>
  );
}





export function ServiceList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data: services } = useQuery({
    queryKey: ["service"],
    queryFn: () => showMyServiceListings(userId),
    enabled: !!userId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // Default: Most Recent
  const itemsPerPage = 5;

  // Get service list and apply sorting
  let serviceList = services?.data || [];

  serviceList = [...serviceList].sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
    }
  });

  // Pagination
  const totalPages = Math.ceil(serviceList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = serviceList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-4">
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

      {/* Service List */}
      {paginatedServices.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
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
    </div>
  );
}


// export function ServiceRequirementList() {
//     const userDetails = getUserDetails();
//     const userId = userDetails?.userId;

//     const { data: services } = useQuery({
//         queryKey: ["serviceRequirements", userId],
//         queryFn: () => getMyServiceRequirements(userId),
//         enabled: !!userId,
//     });

//     return (
//         <div className="space-y-4">
//             {services?.data?.map((service) => (
//                 <ServiceCard key={service._id} {...service} />
//             ))}
//         </div>
//     );
// }


export function ServiceRequirementList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data: services } = useQuery({
      queryKey: ["serviceRequirements", userId],
      queryFn: () => getMyServiceRequirements(userId),
      enabled: !!userId,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("recent"); // Default: Most Recent
  const itemsPerPage = 5;

  // Get service requirement list and apply sorting
  let serviceList = services?.data || [];

  serviceList = [...serviceList].sort((a, b) => {
      if (sortOrder === "recent") {
          return new Date(b.createdAt) - new Date(a.createdAt); // Most recent first
      } else {
          return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
      }
  });

  // Pagination
  const totalPages = Math.ceil(serviceList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = serviceList.slice(startIndex, startIndex + itemsPerPage);

  return (
      <div className="space-y-4">
          {/* Sorting Dropdown */}
          <div className="flex justify-end mb-4">
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

          {/* Service Requirement List */}
          {paginatedServices.map((service) => (
              <ServiceCard key={service._id} {...service} />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
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
      </div>
  );
}
