"use client"

import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { SentProposalList } from "@/components/sent-proposal-list"
import { getUserDetails } from "@/lib/SessionManager"

export default function SentProposalsPage() {
  const user = getUserDetails()

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6">
          <h1 className="text-2xl font-semibold mb-6">Sent Proposals</h1>
          <SentProposalList userId={user?.userId} />
        </main>
      </div>
    </div>
  )
}