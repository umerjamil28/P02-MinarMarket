
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import { getUserDetails } from "@/lib/SessionManager";
import { ServiceDisplayCard } from "@/components/ServiceDisplayCard"


const submitProposal = async (proposalData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposalData),
  });

  const data = await response.json();
  alert(data.message);
  
  if (!response.ok) {
    
   
  } else {
    window.location.href = "/app/seller/buyer-services";
    
  }

  
};

const showMyServiceListings = async (userId) => { 
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/my-listings?listerId=${userId}`, {
    // method: "GET",
    // headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    alert("Failed to fetch service listings");
    return;
  }

  const data = await response.json();
  return data;
};

export function ProposalForm() {
  const [selectedService, setSelectedService] = useState(null);
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const queryClient = useQueryClient();

  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myServiceListings", userId],
    queryFn: () => showMyServiceListings(userId),
    enabled: !!userId,
  });

  const services = data?.data || []; 

  const mutation = useMutation({
    mutationFn: submitProposal,
    onSuccess: () => {
      setSelectedService(null);
      queryClient.invalidateQueries({ queryKey: ["myServiceListings", userId] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedService) return;
  };

  return (
    <div className="w-full max-w-md p-4">
      {selectedService && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Selected Service</h2>
          <ServiceDisplayCard {...selectedService} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="services">
            <AccordionTrigger>Offer against service</AccordionTrigger>
            <AccordionContent>
              {isLoading && <p>Loading services...</p>}
              {isError && <p className="text-red-600">Failed to load services</p>}
              <ul className="space-y-2">
                {services.filter(service => service.status === "Approved").length > 0 ? (
                  services
                    .filter(service => service.status === "Approved")
                    .map((service) => (
                      <li key={service._id}>
                        <Button
                          variant={selectedService?._id === service._id ? "default" : "outline"}
                          onClick={() => setSelectedService(service)}
                          className="w-full justify-start"
                        >
                          {service.title}
                        </Button>
                      </li>
                    ))
                ) : (
                  <p>No services found</p>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          className="w-full"
          onClick={() => {
            if (selectedService) {
              submitProposal({
                sellerId: userId,
                requirementId: serviceId,
                sellerListingId: selectedService._id,
              });
            }
          }}
          disabled={mutation.isLoading || !selectedService}
        >
          {mutation.isLoading ? "Submitting..." : "Submit Proposal"}
        </Button>
      </form>
    </div>
  );
}
