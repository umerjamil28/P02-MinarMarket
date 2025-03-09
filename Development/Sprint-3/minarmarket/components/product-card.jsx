"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function ProductCard({ _id, title, images, price, category, status }) {
const handleCarouselButtonClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
}

return (
  <Card className="group overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
    <Link href={`/app/individual-product/${_id}`}>
      <CardContent className="p-0 cursor-pointer">
        <Badge className="absolute m-2 z-10 bg-gray-800/90 hover:bg-gray-800 text-white">
          {category}
        </Badge>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images?.map((image, index) => (
                <CarouselItem key={image._id || index}>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={image.url || "/placeholder.svg?height=400&width=600"}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
              {images?.length === 0 && (
                <CarouselItem>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </AspectRatio>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious
              className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/90 hover:bg-gray-800 text-white border-none"
              onClick={handleCarouselButtonClick}
            />
            <CarouselNext
              className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/90 hover:bg-gray-800 text-white border-none"
              onClick={handleCarouselButtonClick}
            />
          </Carousel>
          <h3 className="font-semibold py-4 px-4 text-gray-800">{title}</h3>
        </div>
      </CardContent>
    </Link>

    <CardFooter className="flex flex-col items-start gap-2 px-4 pb-4">
      <div className="flex items-center gap-2 w-full justify-between">
        <span className="text-lg font-bold text-gray-900">Rs. {price}</span>
        <Badge variant="secondary" className="bg-gray-800/90 hover:bg-gray-800 text-white">
          Product
        </Badge>
      </div>
    </CardFooter>
  </Card>
)
}

export function ServiceCard({ _id, title, images, rate, category, pricingModel, status }) {
const handleCarouselButtonClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
}

return (
  <Card className="group overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
    <Link href={`/app/individual-service/${_id}`}>
      <CardContent className="p-0">
        <Badge className="absolute m-2 z-10 bg-gray-800/90 hover:bg-gray-800 text-white">
          {category}
        </Badge>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images?.map((image, index) => (
                <CarouselItem key={image._id || index}>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={image.url || "/placeholder.svg?height=400&width=600"}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
              {images?.length === 0 && (
                <CarouselItem>
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </AspectRatio>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious
              className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/90 hover:bg-gray-800 text-white border-none"
              onClick={handleCarouselButtonClick}
            />
            <CarouselNext
              className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/90 hover:bg-gray-800 text-white border-none"
              onClick={handleCarouselButtonClick}
            />
          </Carousel>
          <h3 className="font-semibold py-4 px-4 text-gray-800">{title}</h3>
        </div>
      </CardContent>
    </Link>

    <CardFooter className="flex flex-col items-start gap-2 px-4 pb-4">
      <div className="flex items-center gap-2 w-full justify-between">
        <span className="text-lg font-bold text-gray-900">
          Rs. {rate} / {pricingModel}
        </span>
        <Badge variant="secondary" className="bg-gray-800/90 hover:bg-gray-800 text-white">
          Service
        </Badge>
      </div>
    </CardFooter>
  </Card>
)
}
