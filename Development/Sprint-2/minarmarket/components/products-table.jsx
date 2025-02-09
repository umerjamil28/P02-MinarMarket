"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateProductListingsStatus } from "@/lib/api/admin"

export function ProductsTable({ products, refetch }) {
  const [selectedProducts, setSelectedProducts] = useState([])

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateProductListingsStatus(ids, status),
    onSuccess: () => {
      refetch()
      setSelectedProducts([])
    },
    onError: (error) => {
      console.error('Failed to update status:', error)
    }
  })

  const handleStatusUpdate = (newStatus) => {
    if (selectedProducts.length === 0) return
    updateStatus({ ids: selectedProducts, status: newStatus })
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Listing Requests</h1>
        <div className="space-x-2 mr-8">
          <Button 
            variant="secondary" 
            onClick={() => handleStatusUpdate('Approved')}
            disabled={selectedProducts.length === 0 || isLoading}
          >
            Approve
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleStatusUpdate('Rejected')}
            disabled={selectedProducts.length === 0 || isLoading}
          >
            Reject
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
            <Checkbox
              checked={selectedProducts.length === products.length && products.length > 0}
              indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedProducts(products.map(product => product._id))
                } else {
                  setSelectedProducts([])
                }
              }}
            />
            </TableHead>
            <TableHead>Listing ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
              <Checkbox 
                checked={selectedProducts.includes(product._id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedProducts([...selectedProducts, product._id])
                  } else {
                    setSelectedProducts(selectedProducts.filter(id => id !== product._id))
                  }
                }}
              />
              </TableCell>
              <TableCell className="font-medium text-blue-600">{product._id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.listerId.name}</TableCell>
              <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                    product.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : product.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : product.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {product.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

