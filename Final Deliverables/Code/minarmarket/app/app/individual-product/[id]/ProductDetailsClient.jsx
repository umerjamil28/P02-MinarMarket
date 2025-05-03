"use client"
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ContactSellerButton from '@/components/ContactSellerButton';

export default function ProductDetailsClient({ product, id }) {
  const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token")
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        userId = payload.id
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits/prodvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          productId: id
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      console.log("Interaction recorded successfully:", data)
    } catch (error) {
      console.error("Error recording interaction:", error)
    }
  }

  useEffect(() => {
    recordVisit()
  }, [id]) // Add id as dependency

  if (!product) {
    // Handle case where product data might still be loading or failed on server
    // This check might be redundant if the parent server component handles errors,
    // but it's good practice for client components receiving props.
    return <div>Loading product details...</div>;
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr,400px] gap-8">
      {/* Product Image Carousel */}
      <div className="relative aspect-square mb-6 lg:mb-0">
        <Carousel className="w-full">
          <CarouselContent>
            {product.product.images?.map((image, index) => (
              <CarouselItem key={image._id || index}>
                <AspectRatio ratio={4 / 3}>
                  <Image
                    src={image.url || "https://placehold.co/600x400/png"}
                    alt={`${product.product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Move these buttons inside the Carousel */}
          <CarouselPrevious className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
            <ChevronLeft className="h-6 w-6" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
            <ChevronRight className="h-6 w-6" />
          </CarouselNext>
        </Carousel>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.product.title}</h1>
        <div className="text-2xl font-bold mb-6">Rs. {product.product.price}</div>
        <p className="text-gray-600 mb-6">{product.product.description}</p>
        <div className="mb-6">
          <div className="font-medium mb-2">Category</div>
          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
            {product.product.category}
          </div>
        </div>

        <ContactSellerButton id={id} type={"Product"} />

      </div>
    </div>
  );
}
