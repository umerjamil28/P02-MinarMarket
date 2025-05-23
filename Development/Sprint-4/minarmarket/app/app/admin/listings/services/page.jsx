"use client"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ServicesTable } from "@/components/services-table"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin-header"
import { useQuery } from "@tanstack/react-query";
import {getAllServiceListings} from "@/lib/api/admin"

export default function ServiceListings() {
  const { data, refetch } = useQuery({
    queryKey:['all-service-listings'],
    queryFn: getAllServiceListings
  })
  

  return (
    <div className="flex min-h-screen flex-col px-4">
      <AdminHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <AdminSidebar />
        <main className="flex w-full flex-col gap-8">
          <ServicesTable services={data?.data || []} refetch={refetch} />
        </main>
      </div>
    </div>
  )
}

