"use client";

import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SellerProvider = ({ children }) => {
    const router = useRouter()
    const [loading,setLoading] = useState(true);
    const [type,setType] = useLocalStorage ('type','buyer')

    
    useEffect(() => {
        // Check for token in local Storage

        if (type === 'buyer') {
            // Redirect to signin if no token exists
            router.push('/app/dashboard')
        }
        else{
        setLoading(false)
        }
    }, [type])

    return (
        <>
            {(!!!loading) && children}
        </>
    )
}