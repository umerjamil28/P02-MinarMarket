"use client"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { useQuery } from "@tanstack/react-query";
import {getAllProductsRequirementListings} from "@/lib/api/admin"
import { ProductsRequirementTable } from "@/components/products-requirement-table";


export default function ServiceListings() {
  const { data, refetch } = useQuery({
    queryKey:['all-products-requirement-listings'],
    queryFn: getAllProductsRequirementListings
  })
  

  return (
    <div className="flex min-h-screen flex-col px-4">
      <AdminHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <AdminSidebar />
        <main className="flex w-full flex-col gap-8">
          <ProductsRequirementTable productsRequirement={data?.data || []} refetch={refetch} />
        </main>
      </div>
    </div>
  )
}

