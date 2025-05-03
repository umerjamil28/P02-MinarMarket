// "use client"

// import { useQuery } from "@tanstack/react-query"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import Image from "next/image"

// export function SentProposalList({ userId }) {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['sentProposals', userId],
//     queryFn: async () => {
//       if (!userId) throw new Error('User ID required')
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/seller/${userId}`)
//       if (!res.ok) throw new Error('Failed to fetch proposals')
//       const data = await res.json()
//       return data.proposals
//     },
//     enabled: !!userId
//   })

//   if (isLoading) return <div>Loading proposals...</div>
//   if (error) return <div>Error: {error.message}</div>
//   if (!data || data.length === 0) return <div>No sent proposals found</div>

//   return (
//     <div className="space-y-4">
//       {data.map((proposal) => (
//         <Card key={proposal._id} className="p-4">
//           {/* Status and Date */}
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <h3 className="font-medium">Proposal Status</h3>
//             </div>
//             <Badge variant={
//               proposal.status === 'accepted' ? 'success' :
//                 proposal.status === 'rejected' ? 'destructive' :
//                   'outline'
//             }>
//               {proposal.status}
//             </Badge>
//           </div>

//           {/* Content */}
//           <div className="grid md:grid-cols-2 gap-4">
//             {/* Requirement Details */}
//             <div className="bg-gray-50 p-3 rounded border">
//               <h4 className="text-sm font-semibold text-primary mb-2">Buyer's Requirement</h4>
//               <p className="text-sm font-medium">{proposal.requirementId.title}</p>
//               <p className="text-xs text-gray-600 line-clamp-2 mb-2">
//                 {proposal.requirementId.description}
//               </p>
//   <div className="text-xs">
//     <span className="font-medium">
//       {proposal.requirementId.rate
//         ? `Rate: Rs.${proposal.requirementId.rate}`
//         : `Price: Rs.${proposal.requirementId.price}`}
//     </span>
//     <span className="mx-2">•</span>
//     <span>{proposal.requirementId.category}</span>
//   </div>
//   {proposal.requirementId.rate && proposal.requirementId.pricingModel && (
//     <div className="text-xs text-gray-700 mt-1">
//       <span className="font-medium">Pricing Model:</span> {proposal.requirementId.pricingModel}
//     </div>
//   )}
// </div>



//             <div className="bg-gray-50 p-3 rounded border">
              // <h4 className="text-sm font-semibold text-primary mb-2">
              //   {proposal.requirementId.rate ? "Your Service" : "Your Product"}
              // </h4>
//               <div className="flex gap-3">
//                 {proposal.sellerListingId.images?.[0] && (
//                   <div className="relative h-20 w-20 flex-shrink-0">
//                     <Image
//                       src={proposal.sellerListingId.images[0].url}
//                       alt={proposal.sellerListingId.title}
//                       fill
//                       className="object-cover rounded"
//                     />
//                   </div>
//                 )}
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{proposal.sellerListingId.title}</p>
//                   <p className="text-xs text-gray-600 line-clamp-2 mb-2">
//                     {proposal.sellerListingId.description}
//                   </p>
// <div className="text-xs">
//   <span className="font-medium">
//     {proposal.requirementId.rate
//       ? `Rate: Rs.${proposal.requirementId.rate}`
//       : `Price: Rs.${proposal.sellerListingId.price}`}
//   </span>
//   <span className="mx-2">•</span>
//   <span>{proposal.sellerListingId.category}</span>
// </div>
// {proposal.requirementId.rate && proposal.requirementId.pricingModel && (
//   <div className="text-xs text-gray-700 mt-1">
//     <span className="font-medium">Pricing Model:</span> {proposal.requirementId.pricingModel}
//   </div>
// )}
//                 </div>
//               </div>
//             </div>


//           </div>
//         </Card>
//       ))}
//     </div>
//   )
// }


"use client"

import { useQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState } from "react"

export function SentProposalList({ userId }) {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" for most recent, "asc" for oldest
  const pageSize = 5;

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

  // Sorting proposals
  const sortedData = [...data].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Paginate data
  const startIndex = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2 mb-4">
        <div>Sort By:</div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          <option value="desc">Most Recent</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>


      {paginatedData.map((proposal) => (
        <Card key={proposal._id} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Proposal Status</h3>
            </div>
            <Badge variant={
              proposal.status === 'accepted' ? 'success' :
                proposal.status === 'rejected' ? 'destructive' :
                  'outline'
            }>
              {proposal.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded border">
              <h4 className="text-sm font-semibold text-primary mb-2">Buyer&apos;s Requirement</h4>
              <p className="text-sm font-medium">{proposal.requirementId.title}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {proposal.requirementId.description}
              </p>
              <div className="text-xs">
                <span className="font-medium">
                  {proposal.requirementId.rate
                    ? `Rate: Rs.${proposal.requirementId.rate}`
                    : `Price: Rs.${proposal.requirementId.price}`}
                </span>
                <span className="mx-2">•</span>
                <span>{proposal.requirementId.category}</span>
              </div>
              {proposal.requirementId.rate && proposal.requirementId.pricingModel && (
                <div className="text-xs text-gray-700 mt-1">
                  <span className="font-medium">Pricing Model:</span> {proposal.requirementId.pricingModel}
                </div>
              )}
            </div>


            <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-semibold text-primary mb-2">
                {proposal.requirementId.rate ? "Your Service" : "Your Product"}
              </h4>
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
                      {proposal.requirementId.rate
                        ? `Rate: Rs.${proposal.requirementId.rate}`
                        : `Price: Rs.${proposal.sellerListingId.price}`}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{proposal.sellerListingId.category}</span>
                  </div>
                  {proposal.requirementId.rate && proposal.requirementId.pricingModel && (
                    <div className="text-xs text-gray-700 mt-1">
                      <span className="font-medium">Pricing Model:</span> {proposal.requirementId.pricingModel}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={startIndex + pageSize >= data.length}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}




