import { SellerProvider } from "@/components/providers/SellerProvider";

export default function RootLayout({ children }) {
    return(
        <SellerProvider>
            {children}
        </SellerProvider>
    )
}