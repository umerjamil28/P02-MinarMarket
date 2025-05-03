"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts"; // Import useLocalStorage
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ServiceCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getUserDetails } from "@/lib/SessionManager"; // Import getUserDetails

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const urlUserId = searchParams.get("userId") || null;
  const [searchResults, setSearchResults] = useState({ 
    combined: [],
    products: [], 
    services: [] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);
  const [activeFilter, setActiveFilter] = useState("all");
  const [type] = useLocalStorage("type", "buyer"); // Get user type
  
  // Get user ID only once when component mounts or when URL userId changes
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Only set the userId once on mount or when URL userId changes
    const userDetails = getUserDetails();
    setUserId(urlUserId || userDetails?.userId || null);
  }, [urlUserId]);

  // Define colors based on type
  const primaryColor = type === "buyer" ? "#872CE4" : "#F58014";
  const primaryHoverColor = type === "buyer" ? "#7324c2" : "#d97012"; // Slightly darker hover
  const focusRingColor = type === "buyer" ? "focus:border-purple-400 focus:ring-purple-400" : "focus:border-orange-400 focus:ring-orange-400";
  const spinnerColor = type === "buyer" ? "text-purple-600" : "text-orange-600";
  const backgroundGradient = type === "buyer" ? "from-violet-50 via-white to-orange-50" : "from-orange-50 via-white to-violet-50";
  const activeFilterBg = type === 'buyer' ? 'bg-[#872CE4] hover:bg-[#7324c2]' : 'bg-[#F58014] hover:bg-[#d97012]';
  const activeFilterText = 'text-white'; // Assuming white text for both

  useEffect(() => {
    if (!query) return;
    
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const userIdParam = userId ? `&userId=${userId}` : '';
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/search?q=${encodeURIComponent(query)}${userIdParam}`
        );
        const data = await response.json();

        if (data.success) {
          setSearchResults({
            combined: data.results.combined || [],
            products: data.results.products || [],
            services: data.results.services || []
          });
        } else {
          setError(data.message || "Failed to fetch results");
          setSearchResults({ combined: [], products: [], services: [] });
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("An error occurred while fetching search results");
        setSearchResults({ combined: [], products: [], services: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, userId]); // Only depend on query and userId, not userDetails

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const url = new URL(window.location);
    url.searchParams.set("q", searchInput);
    
    // Include userId in URL if available
    if (userId) {
      url.searchParams.set("userId", userId);
    }
    
    window.history.pushState({}, "", url);
    
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const userIdParam = userId ? `&userId=${userId}` : '';
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/search?q=${encodeURIComponent(
            searchInput
          )}${userIdParam}`
        );
        const data = await response.json();

        if (data.success) {
          setSearchResults({
            combined: data.results.combined || [],
            products: data.results.products || [],
            services: data.results.services || []
          });
        } else {
          setError(data.message || "Failed to fetch results");
          setSearchResults({ combined: [], products: [], services: [] });
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("An error occurred while fetching search results");
        setSearchResults({ combined: [], products: [], services: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  };

  const totalResults = searchResults.combined.length || (searchResults.products.length + searchResults.services.length);

  return (
    <div className={`flex min-h-screen flex-col bg-gradient-to-br ${backgroundGradient}`}>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Results</h1>
          
          <form onSubmit={handleSearch} className="flex items-center max-w-xl">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 z-10 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products and services..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`w-full h-10 pl-10 pr-20 py-2 rounded-md border border-gray-300 focus:outline-none ${focusRingColor} focus:ring-1`} // Apply dynamic focus color
              />
              <Button
                type="submit"
                style={{ backgroundColor: primaryColor }} // Apply dynamic background color
                className={`absolute right-0 h-full text-white px-4 rounded-r-md rounded-l-none`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = primaryHoverColor} // Apply dynamic hover color
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                Search
              </Button>
            </div>
          </form>
        </div> */}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className={`h-10 w-10 animate-spin ${spinnerColor} mb-4`} /> {/* Apply dynamic spinner color */}
            <p className="text-lg text-gray-500">Searching for &quot;{query}&quot;...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-3">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"} 
                onClick={() => setActiveFilter("all")}
                className={activeFilter === 'all' ? `${activeFilterBg} ${activeFilterText}` : ''} // Apply dynamic active filter style
              >
                All ({totalResults})
              </Button>
              <Button 
                variant={activeFilter === "products" ? "default" : "outline"} 
                onClick={() => setActiveFilter("products")}
                className={activeFilter === 'products' ? `${activeFilterBg} ${activeFilterText}` : ''} // Apply dynamic active filter style
              >
                Products ({searchResults.products.length})
              </Button>
              <Button 
                variant={activeFilter === "services" ? "default" : "outline"} 
                onClick={() => setActiveFilter("services")}
                className={activeFilter === 'services' ? `${activeFilterBg} ${activeFilterText}` : ''} // Apply dynamic active filter style
              >
                Services ({searchResults.services.length})
              </Button>
            </div>
            
            {totalResults === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-xl font-semibold text-gray-600">No results found</p>
                <p className="text-gray-400 mt-2">Try searching with different keywords or check spelling.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeFilter === "all" && searchResults.combined && searchResults.combined.map((item) => (
                  item.itemType === 'product' ? (
                    <ProductCard key={item._id} {...item} />
                  ) : (
                    <ServiceCard key={item._id} {...item} />
                  )
                ))}
                
                {activeFilter === "products" && searchResults.products.map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
                
                {activeFilter === "services" && searchResults.services.map((service) => (
                  <ServiceCard key={service._id} {...service} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <SiteFooter />
    </div>
  );
}
