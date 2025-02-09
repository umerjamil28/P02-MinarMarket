"use client"
import Link from "next/link"
import { Search } from 'lucide-react'

import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useLocalStorage } from "@uidotdev/usehooks"

export function AdminHeader() {
  const token = localStorage.getItem('token')
  const [type, setType] = useLocalStorage("type", "buyer");
  const router = useRouter()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background ">
      <div className="container flex h-16  items-center justify-between ">
        <Link href="/app/dashboard" className="font-bold text-xl text-primary">
          MINAR MARKET
        </Link>
        
        <div className="ml-auto flex items-center space-x-16 ">
          <div className="relative ">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="w-[500px] pl-8"
            />
          </div>
          {/* {type === "buyer" ? (
            <Button onClick={() => setType("seller")} variant="outline">Switch to Selling</Button>
          ) : (
            <Button onClick={() => setType("buyer")} variant="outline">Switch to Buying</Button>
          )} */}
          
          
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                  onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/signin')
                    
                  }} 
                  variant="ghost">Sign Out</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

