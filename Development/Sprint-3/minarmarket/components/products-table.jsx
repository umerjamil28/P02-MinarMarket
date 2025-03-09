


"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateProductListingsStatus } from "@/lib/api/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductsTable({ products, refetch }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateProductListingsStatus(ids, status),
    onSuccess: () => {
      refetch();
      setSelectedProducts([]);
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    }
  });

  const handleStatusUpdate = (newStatus) => {
    if (selectedProducts.length === 0) return;
    updateStatus({ ids: selectedProducts, status: newStatus });
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "mostRecent"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Listing Requests</h1>
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
          <Button variant="secondary" onClick={() => handleStatusUpdate("Approved")} disabled={isLoading || selectedProducts.length === 0}>
            Approve
          </Button>
          <Button variant="secondary" onClick={() => handleStatusUpdate("Rejected")} disabled={isLoading || selectedProducts.length === 0}>
            Reject
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                indeterminate={selectedProducts.length > 0 && selectedProducts.length < currentProducts.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedProducts(currentProducts.map(product => product._id));
                  } else {
                    setSelectedProducts([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product._id)}
                  onCheckedChange={(checked) => {
                    setSelectedProducts(prev =>
                      checked ? [...prev, product._id] : prev.filter(id => id !== product._id)
                    );
                  }}
                />
              </TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.listerId.name}</TableCell>
              <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${product.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : product.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {product.status}
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
