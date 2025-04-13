"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateProductsRequirementListingsStatus } from "@/lib/api/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsRequirementTable({ productsRequirement, refetch }) {
  const [selectedProductsRequirement, setSelectedProductsRequirement] = useState([]);
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [currentPage, setCurrentPage] = useState(1);
  const productsRequirementPerPage = 12;

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateProductsRequirementListingsStatus(ids, status),
    onSuccess: () => {
      refetch();
      setSelectedProductsRequirement([]);
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    }
  });

  const handleStatusUpdate = (newStatus) => {
    if (selectedProductsRequirement.length === 0) return;
    updateStatus({ ids: selectedProductsRequirement, status: newStatus });
  };

  const sortedProductsRequirement = [...productsRequirement].sort((a, b) => {
    return sortOrder === "mostRecent"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const indexOfLastProductRequirement = currentPage * productsRequirementPerPage;
  const indexOfFirstProductRequirement = indexOfLastProductRequirement - productsRequirementPerPage;
  const currentProductsRequirement = sortedProductsRequirement.slice(indexOfFirstProductRequirement, indexOfLastProductRequirement);

  const totalPages = Math.ceil(productsRequirement.length / productsRequirementPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products Requirement Listing Requests</h1>
        <div className="space-x-2 flex">
          <Select onValueChange={setSortOrder} value={sortOrder} className="">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mostRecent">Most Recent</SelectItem>
              <SelectItem value="mostOldest">Most Oldest</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={() => handleStatusUpdate("Approved")} disabled={isLoading || selectedProductsRequirement.length === 0}>
            Approve
          </Button>
          <Button variant="secondary" onClick={() => handleStatusUpdate("Rejected")} disabled={isLoading || selectedProductsRequirement.length === 0}>
            Reject
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProductsRequirement.length === currentProductsRequirement.length && currentProductsRequirement.length > 0}
                indeterminate={selectedProductsRequirement.length > 0 && selectedProductsRequirement.length < currentProductsRequirement.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedProductsRequirement(currentProductsRequirement.map(productRequirement => productRequirement._id));
                  } else {
                    setSelectedProductsRequirement([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProductsRequirement.map((productRequirement) => (
            <TableRow key={productRequirement._id}>
              <TableCell>
                <Checkbox
                  checked={selectedProductsRequirement.includes(productRequirement._id)}
                  onCheckedChange={(checked) => {
                    setSelectedProductsRequirement(prev =>
                      checked ? [...prev, productRequirement._id] : prev.filter(id => id !== productRequirement._id)
                    );
                  }}
                />
              </TableCell>
              <TableCell>{productRequirement.title}</TableCell>
              <TableCell>{productRequirement.category}</TableCell>
              <TableCell>${productRequirement.price}</TableCell>
              <TableCell>{productRequirement.listerId.name}</TableCell>
              <TableCell>{new Date(productRequirement.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${productRequirement.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : productRequirement.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {productRequirement.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2 border rounded">Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
