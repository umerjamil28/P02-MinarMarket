import AuthProvider from '@/components/providers/AuthProvider'

export default function RootLayout({ children }) {
    return (
        <AuthProvider>
        <>
            {children}
            </>
        </AuthProvider>
    )
}