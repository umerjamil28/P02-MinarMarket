"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, ShoppingBag, MessageCircle, Store, ClipboardList, Send, Inbox } from "lucide-react"
import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "./ui/scroll-area"
import { motion } from "framer-motion"
import { useLocalStorage } from 'usehooks-ts'
import { FaQuestion } from "react-icons/fa"

function SidebarNavComponent() {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [type, setType] = useLocalStorage("type", "buyer") // Default value
  const [mounted, setMounted] = useState(false)

  const routes = [
    {
      label: {
        seller: "My Listings",
        buyer: "My Requirements",
      },
      icon: type === "buyer" ? ClipboardList : Store,
      href: "/my-listings",
      subitems: {
        buyer: {
          "Product Requirements": "/app/buyer/my-products",
          "Service Requirements": "/app/buyer/my-services",
        },
        seller: {
          Products: "/app/seller/my-products",
          Services: "/app/seller/my-services",
        },
      },
    },
    {
      label: {
        seller: "Buyer Requirements",
      },
      icon: ShoppingBag,
      href: "/app/seller/buyer-requirements",
      subitems: {
        seller: {
          Products: "/app/seller/buyer-products",
          Services: "/app/seller/buyer-services",
        },
      },
    },
    {
      label: {
        buyer: "My Proposals",
      },
      icon: Inbox,
      href: "/proposal",
      subitems: {
        Received: "/app/buyer/received-proposals",
      },
    },
    {
      label: {
        seller: "My Proposals",
      },
      icon: Send,
      href: "/proposal",
      subitems: {
        Sent: "/app/seller/sent-proposal",
      },
    },
    // {
    //   label: {
    //     seller: "Settings",
    //     buyer: "Settings",
    //   },
    //   icon: Settings,
    //   href: "/app/admin",
    // },
    {
      label: {
        seller: "Buyer Queries",
      },
      icon: FaQuestion,
      href: "/app/seller/buyers-messages",
    },
    {
      label: {
        seller: "Chat",
        buyer: "Chat",
      },
      icon: MessageCircle,
      href: "/app/messages",
    },
  ]

  // if (!mounted) return null

  return (
    <nav className="flex flex-col space-y-1">
      <Accordion type="single" collapsible className="space-y-1">
        {routes.map((route) => {
          if (!route.label[type]) return null
          const isActive = pathname === route.href

          return (
            <AccordionItem key={route.href} value={route.href} className="border-none">
              {route.subitems ? (
                <>
                  <AccordionTrigger
                    className={`flex items-center rounded-lg px-3 py-2 transition-all duration-300 ${
                      isActive
                        ? type === "buyer"
                        ? "bg-orange-100 text-[#F58014]"
                          : "bg-violet-100 text-[#872CE4]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <motion.div className="flex items-center" whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                      <route.icon
                        className={`mr-3 h-4 w-4 ${
                          isActive ? (type === "buyer" ? "text-[#872CE4]" : "text-[#F58014]") : "text-gray-600"
                        }`}
                      />
                      <span className="text-sm">{route.label[type]}</span>
                    </motion.div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-0">
                    <div className="pl-4 space-y-1">
                      {route.subitems[type]
                        ? Object.entries(route.subitems[type]).map(([label, href]) => (
                            <motion.div key={href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                              <Link
                                href={href}
                                className={`flex items-center w-full pl-6 py-2 text-sm rounded-lg transition-all duration-300 ${
                                  pathname === href
                                    ? type === "buyer"
                                      ? "bg-violet-100 text-[#872CE4]"
                                      : "bg-orange-100 text-[#F58014]"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full mr-2 ${
                                    pathname === href
                                      ? type === "buyer"
                                        ? "bg-[#872CE4]"
                                        : "bg-[#F58014]"
                                      : "bg-gray-400"
                                  }`}
                                />
                                {label}
                              </Link>
                            </motion.div>
                          ))
                        : Object.entries(route.subitems).map(([label, href]) => (
                            <motion.div key={href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                              <Link
                                href={href}
                                className={`flex items-center w-full pl-6 py-2 text-sm rounded-lg transition-all duration-300 ${
                                  pathname === href
                                    ? type === "buyer"
                                      ? "bg-violet-100 text-[#872CE4]"
                                      : "bg-orange-100 text-[#F58014]"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full mr-2 ${
                                    pathname === href ? "bg-[#872CE4]" : "bg-gray-400"
                                  }`}
                                />
                                {label}
                              </Link>
                            </motion.div>
                          ))}
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={route.href}
                    className={`flex items-center py-2 px-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? type === "buyer"
                          ? "bg-violet-100 text-[#872CE4]"
                          : "bg-orange-100 text-[#F58014]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <route.icon
                      className={`mr-3 h-4 w-4 ${
                        isActive ? (type === "buyer" ? "text-[#872CE4]" : "text-[#F58014]") : "text-gray-600"
                      }`}
                    />
                    <span className="text-sm">{route.label[type]}</span>
                  </Link>
                </motion.div>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </nav>
  )
}

export function SidebarNav() {
  const [type, setType] = useLocalStorage("type", "buyer") // Default value
  
  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-[250px] shrink-0 overflow-y-auto md:sticky md:block bg-white/80 backdrop-blur-sm border-r border-violet-100 rounded-r-xl">
      <ScrollArea className="py-6 pr-6 relative z-10 h-full">
        <div className="flex items-center mb-8 pl-5">
          <div className={`h-8 w-1 rounded-r-full mr-3 ${type === "buyer" ? "bg-[#872CE4]" : "bg-[#F58014]"}`} />
          <h1
            className={`text-xl font-semibold tracking-tight ${type === "buyer" ? "text-[#872CE4]" : "text-[#F58014]"}`}
          >
            {type === "buyer" ? "Buyer " : "Seller "}
            <span className="text-gray-600 font-normal">Dashboard</span>
          </h1>
        </div>
        <div className="pl-2">
          <SidebarNavComponent />
        </div>
      </ScrollArea>
    </aside>
  )
}

