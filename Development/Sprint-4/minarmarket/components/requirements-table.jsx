"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateRequirementStatus } from "@/lib/api/admin"

export function RequirementsTable({ requirements, refetch }) {
  const [selectedRequirements, setSelectedRequirements] = useState([])

  const { mutate: updateStatus, isLoading } = useMutation({
    mutationFn: ({ ids, status }) => updateRequirementStatus(ids, status),
    onSuccess: () => {
      refetch()
      setSelectedRequirements([])
    },
    onError: (error) => {
      console.error('Failed to update status:', error)
    }
  })

  const handleStatusUpdate = (newStatus) => {
    if (selectedRequirements.length === 0) return
    updateStatus({ ids: selectedRequirements, status: newStatus })
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Buyer Product Requirements</h1>
        <div className="space-x-2 mr-8">
          <Button 
            variant="secondary" 
            onClick={() => handleStatusUpdate('Approved')}
            disabled={selectedRequirements.length === 0 || isLoading}
          >
            Approve
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleStatusUpdate('Rejected')}
            disabled={selectedRequirements.length === 0 || isLoading}
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
                checked={selectedRequirements.length === requirements.length && requirements.length > 0}
                indeterminate={selectedRequirements.length > 0 && selectedRequirements.length < requirements.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRequirements(requirements.map(req => req._id))
                  } else {
                    setSelectedRequirements([])
                  }
                }}
              />
            </TableHead>
            <TableHead>Requirement ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Date Listed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.map((requirement) => (
            <TableRow key={requirement._id}>
              <TableCell>
                <Checkbox 
                  checked={selectedRequirements.includes(requirement._id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRequirements([...selectedRequirements, requirement._id])
                    } else {
                      setSelectedRequirements(selectedRequirements.filter(id => id !== requirement._id))
                    }
                  }}
                />
              </TableCell>
              <TableCell className="font-medium text-blue-600">{requirement._id}</TableCell>
              <TableCell>{requirement.title}</TableCell>
              <TableCell>{requirement.category}</TableCell>
              <TableCell>${requirement.price}</TableCell>
              <TableCell>{requirement.listerId?.name || "N/A"}</TableCell>
              <TableCell>{new Date(requirement.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                    requirement.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : requirement.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {requirement.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
