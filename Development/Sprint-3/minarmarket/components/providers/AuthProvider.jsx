'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from '@uidotdev/usehooks'
import { isSessionValid } from '@/lib/SessionManager'

export default function AuthProvider({ children }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    // const [token, setToken] = useLocalStorage("token", null)

    useEffect(() => {
        try {
            setLoading(true)
            const isValid = isSessionValid()
            if (!isValid) {
                setToken(null)
                router.push('/')
            }
        } catch (error) {
            console.error('Session validation error:', error)
            localStorage.removeItem('token')
            router.push('/')
        } finally {
            setLoading(false)
        }
    }, [ router])

    return (
        <>
            {!loading && children}
        </>
    )
}
