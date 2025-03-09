
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ProductCard } from "@/components/product-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductList, RequirementList } from "@/components/data-list"

import { ProductForm } from "@/components/product-form"
import { RequirementForm } from "@/components/requirement-form"

export default function ListProductPage() {
  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
      <SidebarNav />
        <main className="flex-1 px-6">
          <h1 className="text-2xl font-semibold mb-6">List your Requirement</h1>
          <RequirementForm />
        </main>

      </div>
    </div>
  )
}

