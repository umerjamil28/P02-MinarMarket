"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Sparkles } from "lucide-react"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

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

  const signUpSchema = z
    .object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(10, "Phone number must be at least 10 digits"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })

  const signUpMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${credentials.firstName} ${credentials.lastName}`,
          email: credentials.email,
          phone: credentials.phone,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword,
        }),
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message)
      }

      sessionStorage.setItem(
        "signupdata",
        JSON.stringify({
          name: `${credentials.firstName} ${credentials.lastName}`,
          email: credentials.email,
          phone: credentials.phone,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword,
        }),
      )
      localStorage.setItem("email", credentials.email)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      router.push(`/signup/verifyemail/${encodeURIComponent(localStorage.getItem("email"))}`)
    },
    onError: (error) => {
      setApiError(error.message)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const validatedData = signUpSchema.parse(formData)
      setError(null)
      signUpMutation.mutate(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
      }
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden font-sans">
      {/* Left Section - Hero Image */}
      <div className="hidden lg:flex flex-col relative bg-gradient-to-r from-violet-50 to-orange-50 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#872CE4] rounded-full blur-3xl animate-blob opacity-30"></div>
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#F58014] rounded-full blur-3xl animate-blob animation-delay-2000 opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-violet-300 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-30"></div>
          <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-pink-300 rounded-full blur-3xl animate-blob animation-delay-3000 opacity-20"></div>
        </div>

        {/* Mouse follow effect */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: "translate(-50%, -50%)",
            transition: "left 1s ease-out, top 1s ease-out",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
              <Sparkles className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <div className="max-w-2xl text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black mb-6">
              Join MinarMarket Today
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-violet-600 to-orange-400 rounded-full mx-auto mb-6"></div>

            <p className="text-xl md:text-2xl text-gray-700 max-w-xl mx-auto leading-relaxed">
              Create your account to unlock the full potential of MinarMarket. Connect with buyers and sellers in our
              unique marketplace.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-violet-600 hover:text-violet-500 font-medium">
                Sign In
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg">
                <ul className="list-disc list-inside">
                  {error.map((err, index) => (
                    <li key={index}>{err.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {apiError && (
              <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg">
                <p>{apiError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="firstName" className="text-gray-700 text-sm font-medium">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                    className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="lastName" className="text-gray-700 text-sm font-medium">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                    className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange("password")}
                      className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500 pr-10"
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
                <div className="space-y-2 text-left">
                  <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 text-md rounded-md"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
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

        .animation-delay-3000 {
          animation-delay: 3s;
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
      `}</style>
    </div>
  )
}
