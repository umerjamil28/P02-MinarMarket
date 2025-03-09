import Link from "next/link"
import { Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex flex-col py-4">
        <div className="flex items-center justify-between gap-10">
          <Link href="/" className="text-2xl font-bold text-primary">
            MINAR MARKET
          </Link>
          <div className="flex items-center gap-10 flex-1 ">
            <nav className="flex items-center gap-10">
              <Link 
                href="/products"
                className="flex items-center gap-2 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                href="/services" 
                className="flex items-center gap-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                href="/contactus" 
                className="flex items-center gap-2 text-sm font-medium"
              >
                Contact
              </Link>
              <Link
                href="/aboutus" 
                className="flex items-center gap-2 text-sm font-medium"
              >
                About Us
              </Link>
            </nav>
            <div className="relative flex-1 ">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
