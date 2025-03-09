import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function BuyerProductCard({
  _id,
  title,
  images,
  price,
  category,
  status,
}) {
  const handleCarouselButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Card className="overflow-hidden">
      {/* Wrap the entire card content with a Link */}
      <Link href={`/app/individual-product/${_id}`}>
        <CardContent className="p-0 cursor-pointer">
          <Badge variant="default" className="absolute m-2 z-10">
            {category}
          </Badge>
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {images?.length > 0 ? (
                  images.map((image, index) => (
                    <CarouselItem key={image._id || index}>
                      <AspectRatio ratio={4/3}>
                        <Image
                          src={image.url || "https://placehold.co/600x400/png"}
                          alt={`${title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <AspectRatio ratio={4/3}>
                      <Image
                        src="https://placehold.co/600x400/png"
                        alt={`${title} - Image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </AspectRatio>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" onClick={handleCarouselButtonClick} />
              <CarouselNext className="right-2" onClick={handleCarouselButtonClick} />
            </Carousel>

            <h3 className="font-semibold py-4 px-2">{title}</h3>
          </div>
        </CardContent>
      </Link>

      {/* Keep the footer outside the main Link */}
      <CardFooter className="flex flex-col items-start gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Rs. {price}</span>
          <Badge variant="secondary">Product</Badge>
        </div>
        {/* Separate Link for the "Send Proposal" button */}
        <Link href={`/app/seller/proposal?id=${_id}`} className="w-full">
          <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
            Send Proposal
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}

// Keep everything else the same, just replace the BuyerServiceCard component with this:

export function BuyerServiceCard({
  _id,
  title,
  images,
  rate,
  category,
  pricingModel,
  status
}) {
  const handleCarouselButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  
  const getPricingDisplay = () => {
    switch(pricingModel) {
      case "Per Hour":
        return "hr";
      case "Per Day":
        return "day";
      case "Per Job":
        return "job";
      default:
        return "";
    }
  };
  
  return (
    <Card className="overflow-hidden">
      
        <CardContent className="p-0 cursor-pointer">
          <Badge variant="default" className="absolute m-2 z-10">
            {category}
          </Badge>
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {images?.length > 0 ? (
                  images.map((image, index) => (
                    <CarouselItem key={image._id || index}>
                      <AspectRatio ratio={4/3}>
                        <Image
                          src={image.url || "https://placehold.co/600x400/png"}
                          alt={`${title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <AspectRatio ratio={4/3}>
                      <Image
                        src="https://placehold.co/600x400/png"
                        alt={`${title} - Image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </AspectRatio>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-2" onClick={handleCarouselButtonClick} />
              <CarouselNext className="right-2" onClick={handleCarouselButtonClick} />
            </Carousel>
            <h3 className="font-semibold py-4 px-2">{title}</h3>
          </div>
        </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            Rs. {rate}/{getPricingDisplay()}
          </span>
          <Badge variant="secondary">Service</Badge>
        </div>
        {/* <Link href={`/app/seller/service-requirement/${_id}`} className="w-full">
          <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
            View Details
          </button>
        </Link> */}
      </CardFooter>
    </Card>
  )
}

