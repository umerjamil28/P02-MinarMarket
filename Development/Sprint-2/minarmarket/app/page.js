import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { CategoryIcon } from "@/components/category-icon"
import { ProductCard } from "@/components/product-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/data-grid"

const categories = Array.from({ length: 9 }).map((_, i) => ({
  id: `category-${i + 1}`,
  name: `Category ${i + 1}`,
  image: "https://placehold.co/600x600/png",
}))

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-4">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="container relative min-h-[600px] flex items-center">
            {/* <Image
              src=""
              alt="Hero Image"
              fill
              className="object-cover absolute inset-0 -z-10"
              priority
            /> */}
            <div className="flex flex-col items-start gap-4 max-w-2xl relative z-10 bg-white/80 p-8 rounded-lg">
              <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p className="text-muted-foreground">
                Browse through our diverse range of meticulously crafted garments, designed
                to bring out your individuality and cater to your sense of style.
              </p>
              <Button size="lg" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">Product Categories</h2>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
            {categories.map((category) => (
              <div
              key={category.id}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground"
            >
              <div className="relative aspect-square w-12">
                <img
                  src={category.image || ""}
                  alt={category.name}
                  className="rounded-lg object-cover"
                />
              </div>
              <span className="text-xs">{category.name}</span>
            </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">Service Categories</h2>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
            {categories.map((category) => (
              <div
              key={category.id}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground"
            >
              <div className="relative aspect-square w-12">
                <img
                  src={category.image || ""}
                  alt={category.name}
                  className="rounded-lg object-cover"
                />
              </div>
              <span className="text-xs">{category.name}</span>
            </div>
            ))}
          </div>
        </section>
        <ProductGrid />
      </main>
      <SiteFooter />
    </div>
  )
}

