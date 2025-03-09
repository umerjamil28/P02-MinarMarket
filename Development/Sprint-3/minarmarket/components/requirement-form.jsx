"use client"

import { useState, useEffect, use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { productSchema, requirementSchema } from "@/lib/validations/product"
import { updateRequirement, createRequirement } from "@/lib/api/product"
import { fetchProductRequirementDetail} from "@/lib/api/buyer-requirement"
import { useToast } from "@/hooks/use-toast"
import { getUserDetails } from "@/lib/SessionManager"
import { Toaster } from "./ui/toaster"
import { ImageUploader } from "@/components/image-uploader"
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUtils"


const categories = ['Electronics', 'Clothing', 'Books', 'Other']

export function RequirementForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productRequirementId = searchParams.get('id')
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const user = getUserDetails()


  const form = useForm({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      images: [],
    },
  });

  // Fetch product details if editing
  const { data: productRequirementData, isLoading } = useQuery({
    queryKey: ['productRequirement', productRequirementId],
    queryFn: () => fetchProductRequirementDetail(productRequirementId),
    enabled: !!productRequirementId, // Only fetch if productRequirementId exists
  });

  // Prefill form when product data is available
  useEffect(() => {
    if (productRequirementData) {
      form.reset({
        title: productRequirementData.title || "",
        description: productRequirementData.description || "",
        price: productRequirementData.price || "",
        category: productRequirementData.category || "",
        images: productRequirementData.images || [],
      });
      
      // Set the images state with existing images for display in ImageUploader
      if (productRequirementData.images && productRequirementData.images.length > 0) {
        setImages(productRequirementData.images);
      }
    }
  }, [productRequirementData, form]);

  // Handle image upload
  const handleImageUpload = (newImages) => {
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      // Limit to 6 images
      if (updatedImages.length > 6) {
        toast({
          title: "Error",
          description: "Maximum 6 images allowed",
          variant: "destructive",
        });
        return prevImages;
      }
      return updatedImages;
    });
  };

  // Remove image
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Mutations for creating/updating products
  const mutation = useMutation({
    mutationFn: async (formData) => {
      try {
        setUploading(true);

        // Upload images to Cloudinary first if there are any
        let uploadedImagesArray = [];
        if (images.length > 0) {
          // Filter out already uploaded images
          const newImages = images.filter(img => !img.url);
          
          if (newImages.length > 0) {
            uploadedImagesArray = await uploadImagesToCloudinary(newImages);
          }
          
          // Combine existing images and newly uploaded ones
          const existingImages = images.filter(img => img.url);
          uploadedImagesArray = [...existingImages, ...uploadedImagesArray];
        }

        // Prepare final data for submission
        const finalData = {
          ...formData,
          userId: user.userId,
          images: uploadedImagesArray,
        };

        if (productRequirementId) {
          return await updateRequirement(productRequirementId, user.userId, finalData);
        }
        return await createRequirement(finalData);
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast({
        title: productRequirementId ? "Product requirement updated" : "Product requirement created",
        description: "Your product requirement has been submitted for approval.",
      });
      router.push('/app/buyer/my-products');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit() {
    try {
      console.log("submitting");
      const data = form.getValues();
      console.log(data);  
      mutation.mutate(data);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit product requirement",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description (Max. 200 words)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="absolute pl-2 ">PKR</span>
                        <Input className="pl-12" placeholder="0.00" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormItem>
                <FormLabel>Upload Images (Max 6)</FormLabel>
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  onRemoveImage={removeImage}
                  images={images}
                  maxImages={6}
                />
                <p className="text-sm text-muted-foreground">
                  Upload up to 6 images to show what you're looking for
                </p>
              </FormItem>
            </div>
          </div>

          <Button type="submit"
            className="w-full md:w-auto" 
            disabled={mutation.isPending || uploading}>
            {uploading ? "Uploading Images..." : mutation.isPending ? "Submitting..." : "Submit for Approval"}
          </Button>
        </form>
      </Form>
    </>
  )
}

