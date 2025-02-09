'use client'

import { useState } from 'react'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { z } from 'zod'
import {useMutation} from "@tanstack/react-query"
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
    password: '',
    confirmPassword: ''
  })

  const signUpSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    
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
          /**name: fullName,
                email,
                password,
                admin: role.toLowerCase() === 'admin',
                confirmPassword */
            name: `${credentials.firstName} ${credentials.lastName}`,
            email: credentials.email,
            password: credentials.password,
            admin: false,
            confirmPassword: credentials.confirmPassword
        }),
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message)
      }
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      router.push('/app/dashboard') 
    },
    onError: (error) => {
      setApiError(error.message)
      // console.log() 
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const validatedData = signUpSchema.parse(formData)
      // Handle successful validation
      setError(null)
      signUpMutation.mutate(validatedData)
    } catch (error) {
      // Handle validation errors
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
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 rounded-full bg-blue-600" />
        <h1 className="text-2xl font-semibold">Create an account</h1>
      </div>
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
      <p className="text-sm text-muted-foreground mb-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>

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
            <Label htmlFor="confirmPassword">Confirm your password</Label>
            <Input 
              id="confirmPassword" 
              type={showPassword ? "text" : "password"} 
              required 
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showPassword" 
            checked={showPassword}
            onCheckedChange={(checked) => setShowPassword(checked)}
          />
          <Label htmlFor="showPassword" className="text-sm font-normal">
            Show password
          </Label>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create an account
        </Button>
      </form>

      <div className="flex items-center justify-between mt-6">
        {/* <Select defaultValue="en">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English (United States)</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select> */}

        <div className="flex gap-4 text-sm">
          <Link href="/help" className="text-muted-foreground hover:underline">
            Help
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </div>
  )
}

