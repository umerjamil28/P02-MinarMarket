"use client";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ProposalForm } from "@/components/service-proposal-form"; // Ensure this component exists

export default function ServiceProposal() {
  const [type, setType] = useLocalStorage("type", "buyer");

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex-1 px-6">
          <h1 className="text-2xl font-semibold mb-6">Send Service Proposal</h1>
          <ProposalForm />
        </main>
      </div>
    </div>
  );
}
