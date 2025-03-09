"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Users, LayoutDashboard, ListIcon, FileWarning } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const AdminSidebar = () => {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/app/admin/dashboard",
    },
    {
      label: "Manage Listings",
      icon: ListIcon,
      href: "/app/admin/listings",
      subitems: {
        "Products": "/app/admin/listings/products",
        "Services": "/app/admin/listings/services",
      }
    },
    {
      label: "Manage Requirements",
      icon: ListIcon,
      href: "/app/admin/requirements",
      subitems: {
        "Product Requirements": "/app/admin/requirements/products",
        "Service Requirements": "/app/admin/requirements/services",
      }
    },

    // {
    //   label: "Users",
    //   icon: Users,
    //   href: "/app/admin/users",
    // },
    {
      label: "Reports",
      icon: FileWarning,
      href: "/app/admin/reports"
    },
    // {
    //   label: "Settings",
    //   icon: Settings,
    //   href: "/app/admin/settings",
    // }
  ]

  if (!pathname) return null

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
      <ScrollArea className="pb-6 pr-6">
        <h1 className="mb-2   pl-2 text-xl font-semibold">
          Admin Dashboard
        </h1>
        <div className="pl-2 text-sm">
          <nav className="flex flex-col space-y-1">
            <Accordion type="single" collapsible>
              {routes.map((route) => (
                <AccordionItem key={route.href} value={route.href}>
                  {route.subitems ? (
                    <>
                      <AccordionTrigger className={`flex items-center ${pathname === route.href ? "bg-secondary" : ""}`}>
                        <div className="flex items-center">
                          <route.icon className="mr-2 h-4 w-4" />
                          {route.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4">
                          {Object.entries(route.subitems).map(([label, href]) => (
                            <Link
                              key={href}
                              href={href}
                              className="block w-full pl-6 py-2 text-sm text-muted-foreground hover:bg-secondary"
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </>
                  ) : (
                    <Link href={route.href} className={`flex items-center py-3 ${pathname === route.href ? "bg-secondary" : ""}`}>
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Link>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </div>
      </ScrollArea>
    </aside>
  )
}
