
import { Header } from '@/components/header';
import { SidebarNav } from '@/components/sidebar-nav';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getUserDetails } from "@/lib/SessionManager"
import ContactSellerButton from '@/components/ContactSellerButton';


// const user = getUserDetails()
// Fetch service data on the server
async function getService(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-service-details/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    // console.log("data: ", data);
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
    return null;
  }
}


export default async function IndividualServicePage({ params }) {
  const { id } = params; // Get service ID from URL
  let service;

  try {
    service = await getService(id);
  } catch (error) {
    return <div className="text-center text-red-500">Error loading service</div>;
  }

  return (
    
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main>
          <div className="lg:grid lg:grid-cols-[1fr,400px] gap-8">
            {/* service Image Carousel */}
            <div className="relative aspect-square mb-6 lg:mb-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {service.service.images?.map((image, index) => (
                    <CarouselItem key={image._id || index}>
                      <AspectRatio ratio={4 / 3}>
                        <Image
                          src={image.url || "https://placehold.co/600x400/png"}
                          alt={`${service.service.title} - Image ${index + 1}`}
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

            {/* service Details */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{service.service.title}</h1>
              <div className="text-2xl font-bold mb-6">Rs. {service.service.rate} / {service.service.pricingModel}</div>
              <p className="text-gray-600 mb-6">{service.service.description}</p>
              <div className="mb-6">
                <div className="font-medium mb-2">Category</div>
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {service.service.category}
                </div>
              </div>
              
              <ContactSellerButton id={id} type={"Service"} />
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
