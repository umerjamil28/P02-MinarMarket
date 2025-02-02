"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function SentProposalList({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sentProposals', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/seller/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch proposals')
      const data = await res.json()
      return data.proposals
    },
    enabled: !!userId
  })

  if (isLoading) return <div>Loading proposals...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data || data.length === 0) return <div>No sent proposals found</div>

  return (
    <div className="space-y-4">
      {data.map((proposal) => (
        <Card key={proposal._id} className="p-4">
          {/* Status and Date */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Proposal Status</h3>
              {/* <p className="text-xs text-gray-500">
                {new Date(proposal.createdAt).toLocaleDateString()}
              </p> */}
            </div>
            <Badge variant={
              proposal.status === 'accepted' ? 'success' :
              proposal.status === 'rejected' ? 'destructive' : 
              'outline'
            }>
              {proposal.status}
            </Badge>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Requirement Details */}
            <div className="bg-gray-50 p-3 rounded border">
              <h4 className="text-sm font-semibold text-primary mb-2">Buyer's Requirement</h4>
              <p className="text-sm font-medium">{proposal.requirementId.title}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {proposal.requirementId.description}
              </p>
              <div className="text-xs">
                <span className="font-medium">
                  Price: Rs.{proposal.requirementId.price}
                </span>
                <span className="mx-2">•</span>
                <span>{proposal.requirementId.category}</span>
              </div>
            </div>

            {/* Your Product */}
            <div className="bg-gray-50 p-3 rounded border">
              <h4 className="text-sm font-semibold text-primary mb-2">Your Product</h4>
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
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {proposal.sellerListingId.description}
                  </p>
                  <div className="text-xs">
                    <span className="font-medium">
                      Price: Rs.{proposal.sellerListingId.price}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{proposal.sellerListingId.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}