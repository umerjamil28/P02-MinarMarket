"use client"

import Link from "next/link"
import { Search, UserCircle, Menu } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useState, useEffect } from "react"

export function Header() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const [type, setType] = useLocalStorage("type", "buyer")
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gray-900 border-gray-800">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-8">
          {/* Mobile Menu Button */}
          <button
            className="block md:hidden text-gray-200 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded flex items-center justify-center ${
                type === "buyer" ? "bg-teal-600 text-white" : "bg-[#A1D6E2] text-gray-900"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-white">MINAR MARKET</span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <MainNav />
          </div>
        </div>

        {/* Search & Buttons */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-[300px] lg:w-[500px] pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600"
            />
          </div>

          {/* Switch Buyer/Seller Mode */}
          <Button
            onClick={() => setType(type === "buyer" ? "seller" : "buyer")}
            className={`hidden md:flex border-0 text-white ${
              type === "buyer" ? "bg-teal-600 hover:bg-teal-700" : "bg-[#A1D6E2] hover:bg-[#91C5D0] text-gray-900"
            }`}
          >
            Switch to {type === "buyer" ? "Selling" : "Buying"}
          </Button>

          {/* User Menu */}
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-200 hover:text-white hover:bg-gray-800">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800 text-gray-200">
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="hover:bg-gray-800 hover:text-white">
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token")
                      router.push("/signin")
                    }}
                    variant="ghost"
                    className="text-gray-200 hover:text-white p-0"
                  >
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/signin">
                <Button variant="ghost" className="text-gray-200 hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className={`${
                    type === "buyer" ? "bg-teal-600 hover:bg-teal-700" : "bg-[#A1D6E2] hover:bg-[#91C5D0] text-gray-900"
                  }`}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="container py-4 space-y-4">
            <MainNav />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600"
              />
            </div>
            <Button
              onClick={() => setType(type === "buyer" ? "seller" : "buyer")}
              className={`w-full text-white ${
                type === "buyer" ? "bg-teal-600 hover:bg-teal-700" : "bg-[#A1D6E2] hover:bg-[#91C5D0] text-gray-900"
              }`}
            >
              Switch to {type === "buyer" ? "Selling" : "Buying"}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
