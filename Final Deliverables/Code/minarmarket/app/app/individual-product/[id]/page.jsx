"use client"
import { Header } from '@/components/header';
import { SidebarNav } from '@/components/sidebar-nav';
import ProductDetailsClient from './ProductDetailsClient';
import { ProductCard } from '@/components/product-card';
import { useEffect, useState } from "react";

export default function IndividualProductPage({ params }) {
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState(null);

  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedType = localStorage.getItem("type");
    setUserType(storedType);
  }, []);


  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-product-details/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (!response.ok) {
          console.error(`Error fetching product: ${response.status} ${response.statusText}`);
          try {
            const errorData = await response.json();
            console.error("Error details:", errorData);
          } catch (parseError) {
            // No JSON body
          }
          setError("Product not found.");
          return;
        }

        const data = await response.json();
        if (!data || !data.product) {
          throw new Error("Product data is invalid or not found.");
        }
        setProduct(data);

        // Now fetch similar products
        const simResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-similar-products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ id })
        });

        if (!simResponse.ok) {
          console.error(`Error fetching similar products: ${simResponse.status} ${simResponse.statusText}`);
          return;
        }

        const simData = await simResponse.json();
        setSimilarProducts(simData?.similarProducts || []);

      } catch (err) {
        console.error("Error in IndividualProductPage:", err);
        setError("Something went wrong. Please try again later.");
      }
    }

    fetchProduct();
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main>
          {error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : product ? (
            <>
              <ProductDetailsClient product={product} id={id} />

              {userType !== "seller" && similarProducts.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold mb-4 ml-[20px]">Products You May Also Like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarProducts.map((similar) => (
                      <ProductCard
                        key={similar.id}
                        _id={similar._id}
                        title={similar.title}
                        images={similar.images || ""}
                        price={similar.price}
                        category={similar.category}
                        status={similar.status}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">Loading...</div>
          )}
        </main>
      </div>
    </div>
  );
}


