"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/app/products",
      label: "Products",
      active: pathname === "/app/products",
    },
    {
      href: "/app/services",
      label: "Services",
      active: pathname === "/app/services",
    },
    
  ]

  return (
    <nav className="flex items-center space-x-16">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
      
    </nav>
  )
}

