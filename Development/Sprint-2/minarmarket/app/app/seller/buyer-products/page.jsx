"use client"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { BuyerProductCard } from "@/components/buyer-requirement-card"
import { useQuery } from "@tanstack/react-query"
import { getBuyerRequirements } from "@/lib/api/buyer-requirement"
import { getUserDetails } from "@/lib/SessionManager"


export default function BuyerRequirementsPage() {
  const user = getUserDetails()
  
  const { data: requirements, isLoading, error } = useQuery({
    queryKey: ["buyer-requirements"],
    queryFn: () => getBuyerRequirements(),
    enabled: !!user?.userId,
  })

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Buyer Product Requirements</h1>
          </div>
          
          {isLoading && <div>Loading requirements...</div>}
          {error && <div>Error: {error.message}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements?.data?.map((requirement) => (
              <BuyerProductCard
                key={requirement._id} 
                {...requirement}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}