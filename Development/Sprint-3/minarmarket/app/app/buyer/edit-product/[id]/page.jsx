"use client";

import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getUserDetails } from "@/lib/SessionManager";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUtils";
import { ImageUploader } from "@/components/image-uploader";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const productId = params.id;
  const userDetails = getUserDetails();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    // Fetch the requirement data
    const fetchRequirementData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/buyer-requirement/fetch-product-requirement-details/${productId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch requirement data");
        }

        const data = await response.json();
        if (data.success) {
          const requirement = data.data;
          setTitle(requirement.title);
          setDescription(requirement.description);
          setPrice(requirement.price);
          setCategory(requirement.category);
          // Set images if they exist
          if (requirement.images && requirement.images.length > 0) {
            setImages(requirement.images);
          }
        }
      } catch (error) {
        console.error("Error fetching requirement data:", error);
        setMessage("Failed to load requirement data.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRequirementData();
    }
  }, [productId]);

  const handleImageUpload = (newImages) => {
    setImages([...images, ...newImages]);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Upload any new images to Cloudinary first
      let finalImages = [...images];
      
      // Check if there are any File objects that need to be uploaded
      const newImages = images.filter(img => img instanceof File);
      if (newImages.length > 0) {
        setMessage("Uploading images...");
        const uploadedImagesArray = await uploadImagesToCloudinary(newImages);
        
        // Replace File objects with uploaded image objects
        finalImages = images.map(img => {
          if (img instanceof File) {
            // Find the corresponding uploaded image
            const uploadedImg = uploadedImagesArray.find(u => u.name === img.name);
            return uploadedImg || img;
          }
          return img;
        });
      }

      // Update the requirement with the images
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/buyer-listings/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerId: userDetails.userId,
            productId: productId,
            updatedData: {
              title,
              description,
              price: parseFloat(price),
              category,
              images: finalImages,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Product requirement updated successfully!");
        // Redirect back to my products page
        setTimeout(() => {
          router.push("/app/buyer/my-products");
        }, 2000);
      } else {
        setMessage(data.message || "Failed to update product requirement.");
      }
    } catch (error) {
      console.error("Error updating product requirement:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col px-4">
        <Header />
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
          <SidebarNav />
          <main className="flex w-full flex-1 flex-col items-center justify-center">
            <p>Loading requirement data...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Edit Product Requirement</CardTitle>
              <CardDescription>
                Update your product requirement details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter product title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Uploader */}
                <div className="grid gap-2">
                  <Label>Upload Images (Max 6)</Label>
                  <ImageUploader 
                    onImageUpload={handleImageUpload} 
                    onRemoveImage={removeImage}
                    images={images}
                    maxImages={6}
                  />
                  <p className="text-sm text-gray-500">
                    Upload up to 6 images to show what you're looking for
                  </p>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Requirement"}
                </Button>

                {message && (
                  <p className={message.includes("success") ? "text-green-600" : "text-red-600"}>
                    {message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
