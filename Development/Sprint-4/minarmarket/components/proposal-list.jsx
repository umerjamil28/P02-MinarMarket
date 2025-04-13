"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function ProposalList({ userId }) {
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['receivedProposals'],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/received/${userId}`)
            const data = await res.json()
            return data.proposals || [] // Ensure it's always an array
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: async ({ proposalId, status }) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/${proposalId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (!res.ok) {
                throw new Error('Failed to update status')
            }
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['receivedProposals'])
        }
    })

    // Sorting & Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [sortOrder, setSortOrder] = useState("recent") // Default: Most Recent
    const itemsPerPage = 5

    if (isLoading) return <div>Loading proposals...</div>
    if (error) return <div>Error loading proposals: {error.message}</div>
    if (!data || data.length === 0) return <div>No proposals found</div>

    // Sort Proposals
    let sortedProposals = [...data].sort((a, b) => {
        if (sortOrder === "recent") {
            return new Date(b.createdAt) - new Date(a.createdAt) // Most recent first
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt) // Oldest first
        }
    })

    // Pagination
    const totalPages = Math.ceil(sortedProposals.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProposals = sortedProposals.slice(startIndex, startIndex + itemsPerPage)

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'accepted':
                return 'success'
            case 'rejected':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className="space-y-4">
            {/* Sorting Dropdown */}
            <div className="flex justify-end mb-4">
                <label className="mr-2 font-medium">Sort By:</label>
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value)
                        setCurrentPage(1) // Reset to first page when sorting changes
                    }}
                    className="px-3 py-1 border rounded-md"
                >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* Proposals List */}
            {paginatedProposals.map((proposal) => (
                <Card key={proposal._id} className="p-4">
                    {/* Header with dynamic badge */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-medium">{proposal.sellerId.name}</h3>
                            <p className="text-xs text-gray-500">{proposal.sellerId.email}</p>
                        </div>
                        <Badge
                            variant={getStatusBadgeVariant(proposal.status)}
                            className={proposal.status !== 'pending' ? 'capitalize' : ''}
                        >
                            {proposal.status}
                        </Badge>
                    </div>

                    {/* Content Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Requirement */}
                        <div className="bg-gray-50 p-3 rounded border">
                            <h4 className="text-sm font-semibold text-primary mb-2">My Requirement</h4>
                            <p className="text-sm font-medium">{proposal.requirementId.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{proposal.requirementId.description}</p>
                            <div className="text-xs">
                                <span className="font-medium">Price: Rs.{proposal.requirementId.price}</span>
                                <span className="mx-2">•</span>
                                <span>{proposal.requirementId.category}</span>
                            </div>
                        </div>

                        {/* Product */}
                        <div className="bg-gray-50 p-3 rounded border">
                            <h4 className="text-sm font-semibold text-primary mb-2">Offered Product</h4>
                            <div className="flex gap-3">
                                {proposal.sellerListingId.images?.[0] && (
                                    <div className="relative h-20 w-20 flex-shrink-0">
                                        <Image
                                            src={proposal.sellerListingId.images[0].url}
                                            alt={proposal.sellerListingId.title}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{proposal.sellerListingId.title}</p>
                                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{proposal.sellerListingId.description}</p>
                                    <div className="text-xs">
                                        <span className="font-medium">Price: Rs.{proposal.sellerListingId.price}</span>
                                        <span className="mx-2">•</span>
                                        <span>{proposal.sellerListingId.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {proposal.status === 'pending' && (
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateStatusMutation.mutate({
                                    proposalId: proposal._id,
                                    status: 'rejected'
                                })}
                                disabled={updateStatusMutation.isLoading}
                            >
                                {updateStatusMutation.isLoading ? 'Rejecting...' : 'Reject'}
                            </Button>
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => updateStatusMutation.mutate({
                                    proposalId: proposal._id,
                                    status: 'accepted'
                                })}
                                disabled={updateStatusMutation.isLoading}
                            >
                                {updateStatusMutation.isLoading ? 'Accepting...' : 'Accept'}
                            </Button>
                        </div>
                    )}
                </Card>
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
    )
}
