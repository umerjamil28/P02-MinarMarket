            "use client"
            import { Header } from "@/components/header"
            import { SidebarNav } from "@/components/sidebar-nav"
            import { ProductCard } from "@/components/product-card"
            import { ScrollArea } from "@/components/ui/scroll-area"
            import { ProductList, ServiceList } from "@/components/data-list"
            import { useLocalStorage } from "@uidotdev/usehooks"
            import Link from "next/link"
            
            const categories = Array.from({ length: 9 }).map((_, i) => ({
              id: `category-${i + 1}`,
              name: `Category ${i + 1}`,
              image: "https://placehold.co/600x600/png",
            }))
            
            const topSellingProducts = [
              {
                id: "1",
                title: "T-shirt with Tape Details",
                image: "https://placehold.co/600x400/png",
                price: 120,
                rating: 4.5,
                type: "Buyer" ,
              },
              {
                id: "2",
                title: "Fit Shirt",
                image: "https://placehold.co/600x400/png",
                price: 230,
                originalPrice: 260,
                rating: 3.5,
                type: "Seller" ,
              },
              {
                id: "3",
                title: "Fit Jeans",
                image: "https://placehold.co/600x400/png",
                price: 20,
                originalPrice: 260,
                rating: 3.5,
                type: "Seller" ,
              },
              {
                id: "3",
                title: "Fit Jeans",
                image: "https://placehold.co/600x400/png",
                price: 20,
                originalPrice: 260,
                rating: 3.5,
                type: "Buyer" ,
              },
              {
                id: "3",
                title: "Fit Jeans",
                image: "https://placehold.co/600x400/png",
                price: 20,
                originalPrice: 260,
                rating: 3.5,
                type: "Buyer" ,
              },
            ]
            
            export default function DashboardPage() {
              const [type, setType] = useLocalStorage("type", "buyer")
              return (
                <div className="flex min-h-screen flex-col px-4">
                  
                  <Header />
                  <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
                    <SidebarNav />
                    <main className="flex-1 px-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold">My Services</h1>
                            <Link href="/app/seller/list-service" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">List Service</Link>
                        </div>
                        {/* <ProductList />
                         */}
                         <ServiceList />
                        </main>
                  </div>
                </div>
              )
            }
            
            