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
    <Card className="group overflow-hidden border-0 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/app/individual-product/${_id}`} className="flex-shrink-0">
        <CardContent className="p-0 cursor-pointer">
          <Badge className="absolute m-3 z-10 bg-white/90 text-gray-800 hover:bg-white font-medium">{category}</Badge>
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
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border-none"
                onClick={handleCarouselButtonClick}
              />
              <CarouselNext
                className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border-none"
                onClick={handleCarouselButtonClick}
              />
            </Carousel>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col items-start gap-2 px-4 py-4 flex-grow">
        <h3 className="font-medium text-gray-800 line-clamp-2 w-full">{title}</h3>
        <div className="flex items-center gap-2 w-full justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">Rs. {price}</span>
          <Badge variant="outline" className="bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50">
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
    <Card className="group overflow-hidden border-0 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/app/individual-service/${_id}`} className="flex-shrink-0">
        <CardContent className="p-0">
          <Badge className="absolute m-3 z-10 bg-white/90 text-gray-800 hover:bg-white font-medium">{category}</Badge>
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
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border-none"
                onClick={handleCarouselButtonClick}
              />
              <CarouselNext
                className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 border-none"
                onClick={handleCarouselButtonClick}
              />
            </Carousel>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="flex flex-col items-start gap-2 px-4 py-4 flex-grow">
        <h3 className="font-medium text-gray-800 line-clamp-2 w-full">{title}</h3>
        <div className="flex items-center gap-2 w-full justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">
            Rs. {rate} / {pricingModel}
          </span>
          <Badge variant="outline" className="bg-transparent border-gray-200 text-gray-500 hover:bg-gray-50">
            Service
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

