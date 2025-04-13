"use client";

import Link from "next/link"
import { Search, UserCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react"
import { SearchBar } from "@/components/search-bar";
import { useLocalStorage } from 'usehooks-ts'
import { getUserDetails } from "@/lib/SessionManager";

function HeaderComponent() {
  // For storing auth token
  // const [token, setToken] = useLocalStorage('token', null)
  const [type, setType] = useLocalStorage("type", "buyer")
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userdetail = getUserDetails()

  const handleTypeChange = (newType) => {
    setType(newType)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b ${
        type === "buyer" ? "border-violet-200" : "border-orange-200"
      } bg-white/80 backdrop-blur-sm`}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-8">
          <button
            className="block md:hidden text-gray-700 hover:text-[#872CE4]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/app/dashboard" className="flex items-center gap-2 ml-4">
            <span className={`font-bold text-xl ${type === "buyer" ? "text-[#872CE4]" : "text-[#F58014]"}`}>
              MINAR MARKET
            </span>
          </Link>
          <div className="hidden md:block">
            <nav className="flex items-center gap-4 lg:gap-6">
              {userdetail ? (
                <>
                  <Link
                    href="/app/products"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
                  >
                    Products
                  </Link>
                  <Link
                    href="/app/services"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4] transition-colors"
                  >
                    Services
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
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
          {userdetail && (
            <Button
              onClick={() => handleTypeChange(type === "buyer" ? "seller" : "buyer")}
              className={`hidden md:flex border-0 text-white ${
                type === "buyer" ? "bg-[#872CE4] hover:bg-[#872CE4]/90" : "bg-[#F58014] hover:bg-[#F58014]/90"
              } rounded-md`}
            >
              Switch to {type === "buyer" ? "Selling" : "Buying"}
            </Button>
          )}

          {userdetail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-[#872CE4] hover:bg-violet-50 rounded-full"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-violet-100 text-gray-700 rounded-xl shadow-lg"
              >
                {/* <DropdownMenuItem className="hover:bg-violet-50 hover:text-[#872CE4] rounded-lg my-1 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-violet-50 hover:text-[#872CE4] rounded-lg my-1 cursor-pointer">
                  Settings
                </DropdownMenuItem> */}
                <DropdownMenuItem className="hover:bg-violet-50 hover:text-[#872CE4] rounded-lg my-1 cursor-pointer">
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token")
                      // setToken(null)
                      router.push("/")
                    }}
                    variant="ghost"
                    className="text-gray-700 hover:text-[#872CE4] p-0 w-full justify-start"
                  >
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-violet-100 bg-white">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col gap-4 mb-6">
              {userdetail ? (
                <>
                  <Link
                    href="/app/products"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/app/services"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/services"
                    className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                </>
              )}
              <Link
                href="/contactus"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/aboutus"
                className="text-sm font-medium text-gray-600 hover:text-[#872CE4]"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>
            <div className="relative mb-6">
              <SearchBar className="w-full" />
            </div>
            {userdetail && (
              <Button
                onClick={() => handleTypeChange(type === "buyer" ? "seller" : "buyer")}
                className={`w-full text-white ${
                  type === "buyer" ? "bg-[#872CE4] hover:bg-[#872CE4]/90" : "bg-[#F58014] hover:bg-[#F58014]/90"
                } rounded-md`}
              >
                Switch to {type === "buyer" ? "Selling" : "Buying"}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Header() {
  return (
    // <Suspense fallback={<div className="h-16" />}>
      <HeaderComponent />
      // </Suspense>
  )}
