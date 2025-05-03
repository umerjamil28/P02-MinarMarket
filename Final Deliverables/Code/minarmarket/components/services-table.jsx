"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateServiceListingsStatus } from "@/lib/api/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ServicesTable({ services, refetch }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 12;

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateServiceListingsStatus(ids, status),
    onSuccess: () => {
      refetch();
      setSelectedServices([]);
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    }
  });

  const handleStatusUpdate = (newStatus) => {
    if (selectedServices.length === 0) return;
    updateStatus({ ids: selectedServices, status: newStatus });
  };

  const sortedServices = [...services].sort((a, b) => {
    return sortOrder === "mostRecent"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);

  const totalPages = Math.ceil(services.length / servicesPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Services Listing Requests</h1>
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
          <Button variant="secondary" onClick={() => handleStatusUpdate("Approved")} disabled={isLoading || selectedServices.length === 0}>
            Approve
          </Button>
          <Button variant="secondary" onClick={() => handleStatusUpdate("Rejected")} disabled={isLoading || selectedServices.length === 0}>
            Reject
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedServices.length === currentServices.length && currentServices.length > 0}
                indeterminate={selectedServices.length > 0 && selectedServices.length < currentServices.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedServices(currentServices.map(service => service._id));
                  } else {
                    setSelectedServices([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Pricing Model</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentServices.map((service) => (
            <TableRow key={service._id}>
              <TableCell>
                <Checkbox
                  checked={selectedServices.includes(service._id)}
                  onCheckedChange={(checked) => {
                    setSelectedServices(prev =>
                      checked ? [...prev, service._id] : prev.filter(id => id !== service._id)
                    );
                  }}
                />
              </TableCell>
              <TableCell>{service.title}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>Rs. {service.rate}</TableCell>
              <TableCell>{service.pricingModel}</TableCell>
              <TableCell>{service.listerId.name}</TableCell>
              <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${service.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : service.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {service.status}
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
