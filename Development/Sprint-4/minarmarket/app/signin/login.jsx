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
import { Eye, EyeOff } from "lucide-react"

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
        const payload = JSON.parse(atob(token.split(".")[1]))
        userId = payload.id
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,

          page: 100

        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      console.log("Visit recorded successfully:", data)
    } catch (error) {
      console.error("Error recording visit:", error)
    }
  }

  useEffect(() => {
    recordVisit()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
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
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]))

      if (decodedToken.accountStatus === "Banned" || decodedToken.accountStatus === "Suspended") {
        console.warn("User is banned or suspended. Redirecting to /blocked.")
        localStorage.removeItem("token")
        router.push("/banned")
        return
      }

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
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden font-sans">
      {/* Left Section - Hero Image */}
      <div className="hidden lg:flex flex-col relative bg-gradient-to-r from-violet-50 to-orange-50 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#872CE4] rounded-full blur-3xl animate-blob opacity-20"></div>
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#F58014] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-violet-300 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-pink-300 rounded-full blur-3xl animate-blob animation-delay-3000 opacity-10"></div>
        </div>

        {/* Mouse follow effect */}
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

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <div className="max-w-xl">
            <div className="mb-8">
              <div className="h-16 w-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 animate-float-very-slow border border-violet-300/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Welcome Back
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-violet-400 to-orange-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Sign in to access your MinarMarket account and connect with buyers and sellers in our unique marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-4 bg-white p-4 rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in to Your Account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Access your dashboard to post requests, respond to offers, and manage your listings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {formError && (
              <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg">{formError}</div>
            )}

            <div className="space-y-2">
              <div className="space-y-1 text-left">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="h-9 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1 text-left">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="h-9 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  className="border-gray-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Button variant="link" className="text-sm text-violet-600 hover:text-violet-500 p-0">
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white px-8 py-2 text-md rounded-md"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              {"Don't have an account?"}{" "}
              <Link href="/signup" className="text-violet-600 hover:text-violet-500 font-medium">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float-very-slow {
          animation: float-very-slow 8s ease-in-out infinite;
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
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

