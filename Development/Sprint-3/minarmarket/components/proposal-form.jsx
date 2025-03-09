"use client"

// import { getUserDetails } from "@/lib/SessionManager"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";
import { getUserDetails } from "@/lib/SessionManager";
import { ProductCard } from "@/components/product-card";

const submitProposal = async (proposalData) => {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposalData),
  });
  const data = await response.json();
  alert(data.message)
  
  if (!response.ok) {
    setSelectedProduct(null)
    throw new Error("Failed to submit proposal");
  }
  else{
    window.location.href = '/app/seller/buyer-products';
  }
  
  return response.json();
  
};

const showMyProductListings = async (userId) => { 
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/buyer/my-product-listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId }),
    });

  if (!response.ok) {
    alert('Failed to fetch product listings');
    return;
  }

  const data = await response.json();
  return data;
};

export function ProposalForm() {
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const queryClient = useQueryClient();
  


  const userDetails = getUserDetails();
  const userId = userDetails?.userId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myProductListings', userId],
    queryFn: () => showMyProductListings(userId),
    enabled: !!userId,
  });

  const products = data?.data || []; 

  const mutation = useMutation({
    mutationFn: submitProposal,
    onSuccess: () => {
      setPrice("");
      setDescription("");
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ['myProductListings', userId] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;


    // mutation.mutate({
    //   sellerId: userId,
    //   requirementId: productId,
    //   sellerListingId: selectedProduct._id,
    // });
  };

  return (
    <div className="w-full max-w-md p-4">
      {selectedProduct && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Selected Product</h2>
          <ProductCard {...selectedProduct} />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="products">
            <AccordionTrigger>Offer against product</AccordionTrigger>
            <AccordionContent>
              {isLoading && <p>Loading products...</p>}
              {isError && <p className="text-red-600">Failed to load products</p>}
              <ul className="space-y-2">
              {products.filter(product => product.status === "Approved").length > 0 ? (
                products
                  .filter(product => product.status === "Approved") // Filter approved products
                  .map((product) => (
                    <li key={product._id}>
                      <Button
                        variant={selectedProduct?._id === product._id ? "default" : "outline"}
                        onClick={() => setSelectedProduct(product)}
                        className="w-full justify-start"
                      >
                        {product.title}
                      </Button>
                    </li>
                  ))
              ) : (
                <p>No products found</p>
              )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <Button type="submit" className="w-full" disabled={mutation.isLoading || !selectedProduct}>
          onClick={() => submitProposal()}
          {mutation.isLoading ? "Submitting..." : "Submit Proposal"}
        </Button> */}
        <Button 
          className="w-full" 
          onClick={() => {
            if (selectedProduct) {
              submitProposal({
                sellerId: userId,
                requirementId: productId,
                sellerListingId: selectedProduct._id,
              });
            }
          }}
          disabled={mutation.isLoading || !selectedProduct}
        >
          {mutation.isLoading ? "Submitting..." : "Submit Proposal"}
        </Button>
      </form>

      
    </div>
  );
}



