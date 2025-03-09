
import { BuyerProvider } from '@/components/providers/BuyerProvider'

export default function RootLayout({ children }) {
    
    return (
        <BuyerProvider>
            {children}
        </BuyerProvider>
    )
}