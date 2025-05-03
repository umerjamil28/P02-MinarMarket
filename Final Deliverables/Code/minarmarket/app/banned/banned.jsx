"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SuspendedAccountPage() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white/80 relative overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-5 mix-blend-soft-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "rgba(255,255,255,0.3)",
              boxShadow: "0 0 10px rgba(255,255,255,0.2)",
              animation: `float-particle ${Math.random() * 20 + 30}s linear infinite`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Very subtle light effect that follows mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)",
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 1s ease-out, top 1s ease-out",
        }}
      ></div>

      {/* Slow moving gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-20 animate-slide-right-slow"></div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white/90">MinarMarket</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg text-white/80">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white/90">Account Suspended</CardTitle>
              <CardDescription className="text-white/60 mt-2">
                Your account has been temporarily suspended from MinarMarket
              </CardDescription>
            </CardHeader>

            <Separator className="bg-white/10" />

            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-white/90">Why this might have happened:</h3>
                <ul className="list-disc pl-5 space-y-2 text-white/70">
                  <li>Violation of our community guidelines or terms of service</li>
                  <li>Suspicious activity detected on your account</li>
                  <li>Multiple reports from other users</li>
                  <li>Posting prohibited items or services</li>
                  <li>Using the platform for unauthorized commercial purposes</li>
                </ul>
              </div>

              <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-white/90 mb-2">What you can do:</h3>
                <p className="text-white/70">
                  If you believe this suspension was made in error or would like to appeal this decision, please contact
                  our admin team at{" "}
                  <a href="mailto:admin@minarmarket.com" className="text-amber-400 hover:text-amber-300 font-medium">
                    admin@minarmarket.com
                  </a>{" "}
                  with your account details and an explanation of the situation.
                </p>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                <h3 className="font-semibold text-blue-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Important Information
                </h3>
                <p className="text-blue-200/80 mt-1 text-sm">
                  Please include your username, email address, and any relevant information that might help us review
                  your case. Our team typically responds within 1-2 business days.
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white border border-white/10"
                onClick={() => (window.location.href = "mailto:admin@minarmarket.com")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Admin
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white/50 text-sm">
            &copy; {new Date().getFullYear()} MinarMarket. All rights reserved.
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(20px);
          }
          75% {
            transform: translateY(10px) translateX(-10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes slide-right-slow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-slide-right-slow {
          animation: slide-right-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

