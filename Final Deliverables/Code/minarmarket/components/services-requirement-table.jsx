"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateServicesRequirementListingsStatus } from "@/lib/api/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ServicesRequirementTable({ servicesRequirement, refetch }) {
  const [selectedServicesRequirement, setSelectedServicesRequirement] = useState([]);
  const [sortOrder, setSortOrder] = useState("mostRecent");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesRequirementPerPage = 12;

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateServicesRequirementListingsStatus(ids, status),
    onSuccess: () => {
      refetch();
      setSelectedServicesRequirement([]);
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    }
  });

  const handleStatusUpdate = (newStatus) => {
    if (selectedServicesRequirement.length === 0) return;
    updateStatus({ ids: selectedServicesRequirement, status: newStatus });
  };

  const sortedServicesRequirement = [...servicesRequirement].sort((a, b) => {
    return sortOrder === "mostRecent"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  const indexOfLastServiceRequirement = currentPage * servicesRequirementPerPage;
  const indexOfFirstServiceRequirement = indexOfLastServiceRequirement - servicesRequirementPerPage;
  const currentServicesRequirement = sortedServicesRequirement.slice(indexOfFirstServiceRequirement, indexOfLastServiceRequirement);

  const totalPages = Math.ceil(servicesRequirement.length / servicesRequirementPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Services Requirement Listing Requests</h1>
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
          <Button variant="secondary" onClick={() => handleStatusUpdate("Approved")} disabled={isLoading || selectedServicesRequirement.length === 0}>
            Approve
          </Button>
          <Button variant="secondary" onClick={() => handleStatusUpdate("Rejected")} disabled={isLoading || selectedServicesRequirement.length === 0}>
            Reject
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedServicesRequirement.length === currentServicesRequirement.length && currentServicesRequirement.length > 0}
                indeterminate={selectedServicesRequirement.length > 0 && selectedServicesRequirement.length < currentServicesRequirement.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedServicesRequirement(currentServicesRequirement.map(serviceRequirement => serviceRequirement._id));
                  } else {
                    setSelectedServicesRequirement([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Pricing Model</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentServicesRequirement.map((serviceRequirement) => (
            <TableRow key={serviceRequirement._id}>
              <TableCell>
                <Checkbox
                  checked={selectedServicesRequirement.includes(serviceRequirement._id)}
                  onCheckedChange={(checked) => {
                    setSelectedServicesRequirement(prev =>
                      checked ? [...prev, serviceRequirement._id] : prev.filter(id => id !== serviceRequirement._id)
                    );
                  }}
                />
              </TableCell>
              <TableCell>{serviceRequirement.title}</TableCell>
              <TableCell>{serviceRequirement.category}</TableCell>
              <TableCell>Rs. {serviceRequirement.rate}</TableCell>
              <TableCell>{serviceRequirement.pricingModel}</TableCell>
              <TableCell>{serviceRequirement.listerId.name}</TableCell>
              <TableCell>{new Date(serviceRequirement.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${serviceRequirement.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : serviceRequirement.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {serviceRequirement.status}
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
