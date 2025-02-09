"use client";
import { ProductCard, ServiceCard } from "@/components/product-card-list"
import { showMyProductListings, showMyRequirement } from "@/lib/api/product"
import { showMyServiceListings } from "@/lib/api/service";
import { getUserDetails } from "@/lib/SessionManager";
import { useQuery } from "@tanstack/react-query";
import { getMyServiceRequirements } from "@/lib/api/service";

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    title: "Title",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "",
  },
  {
    id: 2,
    title: "Title",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "",
  },
  {
    id: 3,
    title: "Title",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "",
  },
  {
    id: 4,
    title: "Title",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "",
  },
  {
    id: 5,
    title: "Title",
    description:
      "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    image: "",
  },
]

// export function ProductList() {
//   const userId=  getUserDetails().userId;
//   const {data:products} = useQuery({
//     queryKey: ["product"],
//     queryFn: () => showMyProductListings(userId),
//     enabled: !!userId,
//   })
  
//   return (
//     <div className="space-y-4">
//       {products?.data.map((product) => (
//         <ProductCard key={product.id} {...product} />
//       ))}
//     </div>
//   )
// }
export function ProductList() {
  const userDetails = getUserDetails();  // Get user details safely
  const userId = userDetails?.userId;   // Use optional chaining to prevent errors

  const { data: products } = useQuery({
    queryKey: ["product"],
    queryFn: () => showMyProductListings(userId),
    enabled: !!userId,  // Only run query if userId exists
  });

  return (
    <div className="space-y-4">
      {products?.data?.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}


export function RequirementList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const {data:products, isError, error} = useQuery({
    queryKey: ["requirement", userId],
    queryFn: async () => await showMyRequirement(userId),
    enabled: !!userId,
  })

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      {products?.data?.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

// export function ServiceList()
// {
//   const userId=  getUserDetails().userId;
//   const {data:services} = useQuery({
//     queryKey: ["service"],
//     queryFn: () => showMyServiceListings(userId),
//     enabled: !!userId,
//   })
  
//   return (
//     <div className="space-y-4">
//       {services?.data.map((service) => (
//         <ServiceCard key={service.id} {...service} />
//       ))}
//     </div>
//   )
// }
export function ServiceList() {
  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data: services } = useQuery({
    queryKey: ["service"],
    queryFn: () => showMyServiceListings(userId),
    enabled: !!userId,
  });

  return (
    <div className="space-y-4">
      {services?.data?.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
}

export function ServiceRequirementList() {
    const userDetails = getUserDetails();
    const userId = userDetails?.userId;

    const { data: services } = useQuery({
        queryKey: ["serviceRequirements", userId],
        queryFn: () => getMyServiceRequirements(userId),
        enabled: !!userId,
    });

    return (
        <div className="space-y-4">
            {services?.data?.map((service) => (
                <ServiceCard key={service._id} {...service} />
            ))}
        </div>
    );
}