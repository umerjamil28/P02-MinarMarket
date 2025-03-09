"use client"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ProductCard } from "@/components/product-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RequirementList } from "@/components/data-list"
import { useLocalStorage } from "@uidotdev/usehooks"
import Link from "next/link"


export default function MyproductPage() {
  const [type, setType] = useLocalStorage("type", "buyer")
  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Product Requirements</h1>
            <Link href="/app/buyer/list-product" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">List Requirement</Link>
          </div>
          <RequirementList />
        </main>
      </div>
    </div>
  )
}

