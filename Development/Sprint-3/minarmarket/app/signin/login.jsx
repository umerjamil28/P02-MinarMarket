"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [formError, setFormError] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token") 
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        userId = payload.id; // Extract userId from JWT
      
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("Visit recorded successfully:", data);
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  };

  // ✅ Call recordVisit when the page loads
  useEffect(() => {
    recordVisit();
  }, []);

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

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()  
      if (!data.success) {
        throw new Error(data.message)
      }
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
  
      // Decode the JWT token
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]))
  
      // Check for account status
      if (decodedToken.accountStatus === "Banned" || decodedToken.accountStatus === "Suspended") {
        console.warn("User is banned or suspended. Redirecting to /blocked.");
        localStorage.removeItem("token") // Remove token to prevent access
        router.push("/blocked") // Redirect to blocked page
        return; // Stop further execution
      }
  
      // Redirect based on admin status
      if (decodedToken.admin) {
        router.push("/app/admin/dashboard")
      } else {
        router.push("/app/dashboard")
      }
    },
    onError: (error) => {
      setFormError(error.message)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = {
        email: e.target.email.value,
        password: e.target.password.value,
      }

      const validatedData = loginSchema.parse(formData)
      setFormError("")
      loginMutation.mutate(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors[0].message)
        setFormError(error.errors[0].message)
      } else {
        console.error("Unexpected error:", error)
        setFormError("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Enhanced Left Section with Darker Colors and Subtle Animations */}
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900">
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
        </div>

        {/* Subtle animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
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

        {/* Content with subtle animations */}
        <div className="max-w-lg relative z-10">
          <div className="mb-10">
            <div className="h-14 w-14 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center mb-10 animate-float-very-slow border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-6 animate-fade-in" style={{ animationDuration: "1.5s" }}>
            Welcome to MinarMarket
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-400 to-transparent mb-8 animate-width-expand-slow"></div>
          <h2
            className="text-xl font-medium text-white/70 mb-6 animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          >
            A Smarter Way to Buy & Sell
          </h2>
          <p
            className="text-white/60 leading-relaxed animate-fade-in"
            style={{ animationDuration: "2s", animationDelay: "1s" }}
          >
            MinarMarket connects buyers and sellers in a unique way. Unlike traditional marketplaces, buyers can post
            what they need, and sellers can respond with personalized offers. Whether you're looking to buy or sell,
            MinarMarket ensures a seamless and interactive experience.
          </p>
        </div>
      </div>

      {/* Right Section - Original Login Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Sign in to Your Account</h2>
            <p className="text-sm text-muted-foreground">
              Access your dashboard to post requests, respond to offers, and manage your listings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-xs text-slate-600 hover:text-slate-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="text-sm text-slate-600 hover:text-slate-800">
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Loading..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              {"Don't have an account?"}{" "}
              <Link href="/signup" className="text-slate-600 hover:text-slate-800">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations - Slower and More Subtle */}
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
                
                @keyframes float-very-slow {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-5px);
                    }
                    100% {
                        transform: translateY(0px);
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
                
                @keyframes width-expand-slow {
                    0% {
                        width: 0;
                        opacity: 0;
                    }
                    100% {
                        width: 24px;
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
                
                .animate-float-very-slow {
                    animation: float-very-slow 8s ease-in-out infinite;
                }
                
                .animate-fade-in {
                    opacity: 0;
                    animation: fade-in ease-out forwards;
                }
                
                .animate-width-expand-slow {
                    animation: width-expand-slow 2.5s ease-out forwards;
                }
                
                .animate-slide-right-slow {
                    animation: slide-right-slow 20s linear infinite;
                }
            `}</style>
    </div>
  )
}

