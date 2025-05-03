"use client";

import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useState } from "react";
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUtils";
import { ImageUploader } from "@/components/image-uploader";

export default function ListProductPage() {
  const router = useRouter();
  const userDetails = getUserDetails();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

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
      // Upload images to Cloudinary first
      let uploadedImagesArray = [];
      if (images.length > 0) {
        setMessage("Uploading images...");
        uploadedImagesArray = await uploadImagesToCloudinary(images);
        setUploadedImages(uploadedImagesArray);
      }

      // Create product requirement with uploaded images
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/buyer-requirement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            price: parseFloat(price),
            category,
            userId: userDetails.userId,
            images: uploadedImagesArray,
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setMessage("Product requirement listed successfully!");
        // Redirect to my products page after successful submission
        setTimeout(() => {
          router.push("/app/buyer/my-products");
        }, 2000);
      } else {
        setMessage(data.message || "Failed to list product requirement.");
      }
    } catch (error) {
      console.error("Error listing product requirement:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-4">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-4 md:py-6">
        <SidebarNav />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>List Product Requirement</CardTitle>
              <CardDescription>
                What product are you looking for?
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
                    Upload up to 6 images to show what you&apos;re looking for
                  </p>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "List Requirement"}
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