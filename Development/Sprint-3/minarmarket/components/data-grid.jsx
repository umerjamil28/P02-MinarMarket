"use client"

import { useQuery } from "@tanstack/react-query"
import { ProductCard, ServiceCard } from "./product-card"

export function ProductGrid({ userId }) {
  const { data: topSellingProducts } = useQuery({
    queryKey: ["top-selling-products", userId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling products")
      }

      const data = await response.json()
      return data.data
    },
    initialData: [],
  })

  const { data: topSellingServices } = useQuery({
    queryKey: ["top-selling-services", userId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling services")
      }
      const data = await response.json()

      return data.data
    },
    initialData: [],
  })

  return (
    <div className="space-y-12">
      {topSellingProducts?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">TOP SELLING PRODUCTS</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topSellingProducts?.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        </section>
      )}

      {topSellingServices?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">TOP SELLING SERVICES</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topSellingServices?.map((service) => (
              <ServiceCard key={service._id} {...service} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export function ProductOnlyGrid({ userId }) {
  const { data: topSellingProducts } = useQuery({
    queryKey: ["top-selling-products", userId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling products")
      }

      const data = await response.json()
      return data.data
    },
    initialData: [],
  })

  return (
    <section className="container py-8">
      <h2 className="mb-8 text-2xl font-bold">TOP SELLING PRODUCTS</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topSellingProducts?.map((product) => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </section>
  )
}

export function ServiceOnlyGrid({ userId }) {
  const { data: topSellingServices } = useQuery({
    queryKey: ["top-selling-services", userId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling services")
      }
      const data = await response.json()

      return data.data
    },
    initialData: [],
  })

  return (
    <section className="container py-8">
      <h2 className="mb-8 text-2xl font-bold">TOP SELLING SERVICES</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {topSellingServices?.map((service) => (
          <ServiceCard key={service._id} {...service} />
        ))}
      </div>
    </section>
  )
}

export function LandingPageProductGrid() {
  const { data: landingPageProducts } = useQuery({
    queryKey: ["top-selling-products"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-landing-page-products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling products")
      }

      const data = await response.json()
      return data.data
    },
    initialData: [],
  })

  const { data: landingPageServices } = useQuery({
    queryKey: ["top-selling-services"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-landing-page-services`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch top-selling services")
      }
      const data = await response.json()

      return data.data
    },
    initialData: [],
  })

  return (
    <div className="space-y-12">
      {landingPageProducts?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">TOP SELLING PRODUCTS</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {landingPageProducts?.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        </section>
      )}

      {landingPageServices?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">TOP SELLING SERVICES</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {landingPageServices?.map((service) => (
              <ServiceCard key={service._id} {...service} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
