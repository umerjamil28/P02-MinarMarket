"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Tabs({ children, className, ...props }) {
  return <div className={cn("border-b border-gray-200", className)} {...props}>{children}</div>
}

export function TabsList({ children, className, ...props }) {
  return <div className={cn("flex space-x-4", className)} {...props}>{children}</div>
}

export function TabsTrigger({ children, className, ...props }) {
  return <button className={cn("px-4 py-2 text-gray-700", className)} {...props}>{children}</button>
}

export function TabsContent({ children, className, ...props }) {
  return <div className={cn("p-4", className)} {...props}>{children}</div>
}
