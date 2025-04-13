"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductsContent } from "@/components/products-content"

export default function PublicProductsPage() {
  const [type] = useState("buyer")

  const recordVisit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: null,
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

  // Define colors
  const primaryColor = "#872CE4"
  const secondaryColor = "#9F5AE5"
  const lightBgClass = "from-violet-50 to-white"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgClass}`}>
      <SiteHeader />
      <div className="container mx-auto py-8 px-4">
        <ProductsContent userId={null} type={type} />
      </div>
      
      <SiteFooter />

      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
          style={{ backgroundColor: "rgb(216, 180, 254)" }}
        ></div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}