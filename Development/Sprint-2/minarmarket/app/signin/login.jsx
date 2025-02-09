'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const [formError, setFormError] = useState('')

    const loginSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    })
    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('tokenStatus', data.tokenStatus ? data.tokenStatus.join(',') : '');
            router.push('/app/dashboard');
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
            setFormError('')
            loginMutation.mutate(validatedData)

        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error('Validation error:', error.errors[0].message) // Added console log
                setFormError(error.errors[0].message)
            } else {
                console.error('Unexpected error:', error) // Added console log
                setFormError('An unexpected error occurred')
            }
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Section */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-700">
                <div className="max-w-lg">
                    <h1 className="text-4xl font-bold text-white mb-4">WELCOME</h1>
                    <h2 className="text-xl font-medium text-white mb-4">YOUR HEADLINE NAME</h2>
                    <p className="text-blue-100">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed dolm nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim quis nostrud exerci tation
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold">Sign in</h2>
                        <p className="text-sm text-muted-foreground">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formError && (
                            <div className="text-red-500 text-sm">{formError}</div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Enter your username" required />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-xs text-blue-600 hover:text-blue-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </Button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm">Remember me</Label>
                            </div>
                            <Button variant="link" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot Password?
                            </Button>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Loading...' : 'Sign In'}
                        </Button>

                        <div className="text-center text-sm">
                            {"Don't have an account?"}{' '}
                            <Link href="/signup" className="text-blue-600 hover:text-blue-500">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}