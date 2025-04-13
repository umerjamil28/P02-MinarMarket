"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchBar } from "@/components/search-bar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-200 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-8">
          <Link href="/" className="flex items-center gap-2 ml-4">
            <span className="font-bold text-xl text-[#872CE4]">
              MINAR MARKET
            </span>
          </Link>
          <div className="hidden md:block">
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/products"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
              >
                Products
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
              >
                Services
              </Link>
              <Link
                href="/contactus"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/aboutus"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
              >
                About Us
              </Link>
            </nav>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center">
          <SearchBar className="max-w-md w-full" />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-700 hover:text-[#872CE4] hover:bg-violet-50 rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#872CE4] hover:bg-[#872CE4]/90 text-white rounded-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

