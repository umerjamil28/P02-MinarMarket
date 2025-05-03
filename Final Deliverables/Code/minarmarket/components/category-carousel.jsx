"use client"

import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export function CategoryCarousel({ categories, onCategoryClick, primaryColor, secondaryColor }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <div className="relative px-6"> {/* Added horizontal padding to contain buttons */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1"> {/* Reduced negative margin */}
          {categories.map((category, index) => (
            <CarouselItem key={index} className="pl-1 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7"> {/* Adjusted basis and padding */}
              <div className="p-1">
                <Card
                  className="group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-28 flex flex-col" // Reduced height to h-32
                  onClick={() => onCategoryClick(category.name)}
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 flex-grow text-white"> {/* Reduced padding */}
                    <div className="text-4xl mb-1 transition-transform duration-300 group-hover:scale-110"> {/* Reduced icon size and margin */}
                      {category.icon}
                    </div>
                    <span className="text-xs font-medium text-center">{category.name}</span> {/* Adjusted text size */}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md h-8 w-8" /> {/* Adjusted left position */}
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md h-8 w-8" /> {/* Adjusted right position */}
      </Carousel>
    </div>
  )
}
