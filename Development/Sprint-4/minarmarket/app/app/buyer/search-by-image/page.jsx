"use client";

import { useState } from "react";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUtils"
import Link from 'next/link'; 

export default function SearchByImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
  
    setLoading(true);
    try {
      // Upload the image using the uploadImagesToCloudinary function
      const uploadedImage = await uploadImagesToCloudinary([file]);
      console.log(uploadedImage);  // Log the uploaded image array to check the structure
  
      // Ensure we are accessing the correct property (url)
      const imageUrl = uploadedImage[0]?.url;  // Use .url instead of .secure_url
  
      if (!imageUrl) {
        throw new Error("Image URL is undefined");
      }
  
      
  
      // Make the request to the backend with the image URL
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-listings/images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        }
      );
  
      const data = await response.json();
      setResults(data.matches || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Search by Image</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label className="w-full border-2 border-dashed border-purple-400 rounded-xl p-6 text-center cursor-pointer hover:bg-purple-50">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {preview ? (
              <img src={preview} alt="Preview" className="mx-auto h-48 object-contain" />
            ) : (
              <span className="text-gray-600">Click or drag an image here to upload</span>
            )}
          </label>

          <button
            type="submit"
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {!loading && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Matching Products</h2>
    {results.length > 0 ? (
      <div className="space-y-4">
        {results.map(({ product, similarity }, idx) => (
          <Link
            key={idx}
            href={`/app/individual-product/${product._id}`}
            className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex gap-4 items-center">
              <img
                src={product.images[0]?.url}
                alt={product.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-sm">No matching products found.</p>
    )}
  </div>
)}

      </div>
    </div>
  );
}

