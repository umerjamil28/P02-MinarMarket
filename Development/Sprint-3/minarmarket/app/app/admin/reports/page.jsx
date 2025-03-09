"use client"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ProductsTable } from "@/components/products-table"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin-header"
import { useQuery } from "@tanstack/react-query";
import { getAllComplaints } from "@/lib/api/admin"
import { AdminReportsTable } from "@/components/admin-reports"

export default function AdminReportsSection() {
  const { data, refetch } = useQuery({
    queryKey:['all-complaints'],
    queryFn: getAllComplaints
  })
  

  return (
    <div className="flex min-h-screen flex-col px-4">
      <AdminHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <AdminSidebar />
        <main className="flex w-full flex-col gap-8">
        <AdminReportsTable reports={data?.complaints || []} refetch={refetch} />
        </main>
      </div>
    </div>
  )
}

