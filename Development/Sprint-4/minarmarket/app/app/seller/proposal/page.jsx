"use client"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ProductCard } from "@/components/product-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductList } from "@/components/data-list"
import { useLocalStorage } from 'usehooks-ts'
import { ProposalForm } from "@/components/proposal-form"
import Link from "next/link"


export default function Proposal() {
  const [type, setType] = useLocalStorage("type", "buyer")
  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6 ">
        <h1 className="text-2xl font-semibold mb-6">Send Proposal</h1>
        <ProposalForm />
        </main>
      </div>
    </div>
  )
}

