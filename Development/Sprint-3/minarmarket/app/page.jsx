"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LandingPageProductGrid } from "@/components/data-grid";
import {
  FaLaptop, FaTshirt, FaBook, FaShoePrints, FaCouch, FaPumpSoap, FaGamepad, FaBox,
  FaCut, FaWrench, FaHammer, FaBolt, FaLeaf, FaUtensils, FaBroom, FaCode, FaPaintBrush, FaTools
} from "react-icons/fa";
import { ServiceCard } from "@/components/product-card";
import { ProductCard } from "@/components/product-card";

const productCategories = [
  { name: "Electronics", icon: <FaLaptop /> },
  { name: "Clothing", icon: <FaTshirt /> },
  { name: "Books", icon: <FaBook /> },
  { name: "Footwear", icon: <FaShoePrints /> },
  { name: "Furniture", icon: <FaCouch /> },
  { name: "Beauty and Personal Care", icon: <FaPumpSoap /> },
  { name: "Toys", icon: <FaGamepad /> },
  { name: "Other", icon: <FaBox /> },
];

const serviceCategories = [
  { name: "Haircut", icon: <FaCut /> },
  { name: "Plumbing", icon: <FaWrench /> },
  { name: "Carpentry", icon: <FaHammer /> },
  { name: "Electrical", icon: <FaBolt /> },
  { name: "Gardening", icon: <FaLeaf /> },
  { name: "Catering", icon: <FaUtensils /> },
  { name: "House Help", icon: <FaBroom /> },
  { name: "Web Development", icon: <FaCode /> },
  { name: "Design", icon: <FaPaintBrush /> },
  { name: "Other", icon: <FaTools /> },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryType, setCategoryType] = useState(null);


    const recordVisit = async () => {
    try {
      const token = localStorage.getItem("token") 
      let userId = null
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        userId = payload.id; // Extract userId from JWT
      
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webvisits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || null,
          userAgent: navigator.userAgent,
          page: 2, 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("Visit recorded successfully:", data);
    } catch (error) {
      console.error("Error recording visit:", error);
    }
  };

  // ✅ Call recordVisit when the page loads
  useEffect(() => {
    recordVisit();
  }, []);
  
  const fetchProductsByCategory = async (category) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-category-landing-page/${category}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setCategoryItems(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setCategoryItems([]);
    }
  };

  const fetchServicesByCategory = async (category) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-category-landing-page/${category}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setCategoryItems(data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setCategoryItems([]);
    }
  };

  const handleCategoryClick = (category, type) => {
    setSelectedCategory(category);
    setCategoryType(type);
    type === "product" ? fetchProductsByCategory(category) : fetchServicesByCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setCategoryItems([]);
    setCategoryType(null);
  };


  return (
    <div className="flex min-h-screen flex-col px-4">
      <SiteHeader />

      <main className="flex-1">
        {!selectedCategory ? (
          <>
            <section className="relative">
              <div className="container relative min-h-[400px] flex items-center">
                <div className="flex flex-col items-start gap-4 max-w-2xl relative z-10 bg-white/80 p-8 rounded-lg">
                  <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
                    FIND THE ITEMS AND SERVICES THAT YOU NEED
                  </h1>
                  <p className="text-muted-foreground">
                    Browse through our diverse range of products and services that fit your needs.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/products">Shop Now</Link>
                  </Button>
                </div>
              </div>
            </section>



            {/* Product Categories */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">Product Categories</h2>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-8">
                {productCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex aspect-square flex-col items-center justify-center cursor-pointer gap-2 rounded-lg border bg-card text-card-foreground"
                    onClick={() => handleCategoryClick(category.name, "product")}
                  >
                    <div className="relative flex items-center justify-center w-16 h-16 text-5xl text-gray-700">
                      {category.icon}
                    </div>
                    <span className="text-xs">{category.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Service Categories */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">Service Categories</h2>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-8">
                {serviceCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex aspect-square flex-col items-center cursor-pointer justify-center gap-2 rounded-lg border bg-card p-4 text-card-foreground"
                    onClick={() => handleCategoryClick(category.name, "service")}
                  >
                    <div className="relative flex items-center justify-center w-16 h-16 text-5xl text-gray-700">
                      {category.icon}
                    </div>
                    <span className="text-xs">{category.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <LandingPageProductGrid />
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              className="mb-4 mt-10 px-4 py-2 bg-gray-300 rounded-md w-fit hover:bg-gray-400"
              onClick={handleBackClick}
            >
              ← Back to Categories
            </button>

            {/* Selected Category Items */}
            <section>
              <h2 className="mb-6 text-2xl font-bold">
                {categoryType === "product" ? "Products" : "Services"} in {selectedCategory}
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {categoryItems.length > 0 ? (
                  categoryItems.map((item, index) =>
                    categoryType === "product" ? (
                      <ProductCard
                        key={item.id || index}
                        _id={item._id}
                        title={item.title}
                        images={item.images || ""}
                        price={item.price}
                        category={item.category}
                        status={item.status}
                      />
                    ) : (
                      <ServiceCard
                        key={item.id || index}
                        _id={item._id}
                        title={item.title}
                        images={item.images || ""}
                        rate={item.rate}
                        category={item.category}
                        pricingModel={item.pricingModel}
                        status={item.status}
                      />
                    )
                  )
                ) : (
                  <p className="text-center col-span-full">
                    No {categoryType === "product" ? "products" : "services"} found for {selectedCategory}.
                  </p>
                )}
              </div>
            </section>

          </>
        )}


      </main>
      <SiteFooter />
    </div>
  );
}
