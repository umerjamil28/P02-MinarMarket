'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from 'zod'
import { useMutation } from "@tanstack/react-query"
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [apiError, setApiError] = useState(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
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
  const signUpSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be at most 100 characters'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

  const signUpMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${credentials.firstName} ${credentials.lastName}`,
          email: credentials.email,
          phone: credentials.phone,
          password: credentials.password,
          confirmPassword: credentials.confirmPassword
        }),
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message)
      }
      sessionStorage.setItem('signupdata',JSON.stringify({
        name: `${credentials.firstName} ${credentials.lastName}`,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword
      }))
      localStorage.setItem('email', credentials.email)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      // router.push('/app/dashboard')
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
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      {error && ( 
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <ul className="list-disc list-inside text-sm text-red-600">
            {error.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input 
              id="firstName" 
              required 
              value={formData.firstName}
              onChange={handleChange('firstName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input 
              id="lastName" 
              required 
              value={formData.lastName}
              onChange={handleChange('lastName')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            value={formData.email}
            onChange={handleChange('email')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input 
            id="phone" 
            type="tel" 
            required 
            value={formData.phone}
            onChange={handleChange('phone')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.password}
              onChange={handleChange('password')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create an account
        </Button>
      </form>
    </div>
  )
}
