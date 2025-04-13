"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { getUserDetails } from "@/lib/SessionManager"
import { useLocalStorage } from 'usehooks-ts'
import { ProductsContent } from "@/components/products-content"

export default function ProductsPage() {
  const [userDetails, setUserDetails] = useState(getUserDetails())
  const userId = userDetails?.userId || null
  const [type] = useLocalStorage("type", "buyer")

  const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token")
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        userId = payload.id
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,
          page: 4,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
    } catch (error) {
      console.error("Error recording visit:", error)
    }
  }

  useEffect(() => {
    recordVisit()
  }, [])

  // Get colors based on type
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014"
  const secondaryColor = type === "buyer" ? "#9F5AE5" : "#FF9D4D"
  const lightBgClass = type === "buyer" ? "from-violet-50 to-white" : "from-orange-50 to-white"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgClass}`}>
      <Header />
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[250px_1fr] md:gap-8 md:py-8">
      <SidebarNav />  
      <ProductsContent userId={userId} type={type} />
      </div>

      {/* Add blob animations similar to dashboard page */}
      {/* <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob opacity-[0.03]"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-[0.03]"
          style={{ backgroundColor: secondaryColor }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-4000 opacity-[0.03]"
          style={{ backgroundColor: type === "buyer" ? "rgb(216, 180, 254)" : "rgb(255, 207, 159)" }}
        ></div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style> */}
    </div>
  )
}
