"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, ShoppingBag, FileText, ChevronDown, ChevronUp, Settings2, MessageCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLocalStorage } from "@uidotdev/usehooks"
import { ScrollArea } from "./ui/scroll-area"

function SidebarNavComponent() {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [type, setType] = useLocalStorage("type", "buyer");

  const routes = [
    {
      label: {
        "seller": "My Listings",
        "buyer": "My Requirements"
      },
      icon: ShoppingBag,
      href: "/my-listings",
      subitems: {
        "buyer": {
          "Product Requirements": "/app/buyer/my-products",
          "Service Requirements": "/app/buyer/my-services",
        },
        "seller": {
          "Products": "/app/seller/my-products",
          "Services": "/app/seller/my-services",
        }
      }
    },
    {
      label: {
        "seller": "Buyer Requirements",
        
      },
      icon: ShoppingBag,
      href: "/app/seller/buyer-requirements",
      subitems: {
        
        "seller": {
          "Products": "/app/seller/buyer-products",
          "Services": "/app/seller/buyer-services",
        }
      }
    },
    {
      label: {
        
        "buyer": "My Proposals"
      },
      icon: FileText,
      href: "/proposal",
      subitems: {
        "Received": "/app/buyer/received-proposals",
        
      }
    },
    {
      label: {
        "seller": "My Proposals",
        
      },
      icon: FileText,
      href: "/proposal",
      subitems: {
        
        "Sent": "/app/seller/sent-proposal",
      }
    },
    {
      label: {
        "seller": "Settings",
        "buyer": "Settings"
      },  
      icon: Settings,
      href: "/app/admin",
    },

    {
      label: {
        "seller": "Message Received",
      },  
      icon: MessageCircle,
      href: "/app/seller/buyers-messages",
    },
    

    
  ];
  

 

  return (
    <nav className="flex flex-col space-y-1 text-sm">
      <Accordion type="single" collapsible>
        {routes.map((route) => {
          // Check if route should be shown for current type
          if (!route.label[type]) return null;

          return (
            <AccordionItem key={route.href} value={route.href}>
              {route.subitems ? (
                <>
                  <AccordionTrigger className={`flex items-center ${pathname === route.href ? "bg-secondary" : ""}`}>
                    <div className="flex items-center">
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label[type]}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4">
                      {route.subitems[type] ? 
                        // Handle type-specific subitems
                        Object.entries(route.subitems[type]).map(([label, href]) => (
                          <Link
                            key={href}
                            href={href}
                            className="block w-full pl-6 py-2 text-sm text-muted-foreground hover:bg-secondary"
                          >
                            {label}
                          </Link>
                        ))
                        : 
                        // Handle regular subitems
                        Object.entries(route.subitems).map(([label, href]) => (
                          <Link
                            key={href}
                            href={href}
                            className="block w-full pl-6 py-2 text-sm text-muted-foreground hover:bg-secondary"
                          >
                            {label}
                          </Link>
                        ))
                      }
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <Link href={route.href} className={`flex items-center py-3 ${pathname === route.href ? "bg-secondary" : ""}`}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label[type]}
                </Link>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </nav>
  )
}

export function SidebarNav() {
  const [type, setType] = useLocalStorage("type", "buyer");
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
      <ScrollArea className="pb-6 pr-6 ">
        <h1 className="mb-2 pl-2 text-xl font-semibold">
          {type === "buyer" ? "Buyer " : "Seller "}
          Dashboard
        </h1>
        <div className="pl-2">
          <SidebarNavComponent />
        </div>
      </ScrollArea>
    </aside>
  )
}
