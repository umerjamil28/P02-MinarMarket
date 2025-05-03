"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { productSchema, requirementSchema } from "@/lib/validations/product"
import { serviceSchema } from "@/lib/validations/service"
import { createService, updateService, uploadToCloudinary, createServiceRequirement } from "@/lib/api/service"
import { useToast } from "@/hooks/use-toast"
import { getUserDetails } from "@/lib/SessionManager"
import { Toaster } from "./ui/toaster"
import { fetchServiceRequirementDetail } from "@/lib/api/buyer-requirement"
import { ImageUploader } from "@/components/image-uploader"
import { uploadImagesToCloudinary } from "@/lib/cloudinaryUtils"

const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Other"]

export function ServiceRequirementForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceRequirementId = searchParams.get('id')
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState([])
  const user = getUserDetails()

  // Fetch service data if editing
  const { data: serviceData } = useQuery({
    queryKey: ['service', serviceRequirementId],
    queryFn: () => fetchServiceRequirementDetail(serviceRequirementId),
    enabled: !!serviceRequirementId
  })

  console.log("serviceData: ", serviceData);

  const form = useForm({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      title: serviceData?.title || "",
      description: serviceData?.description || "",
      rate: serviceData?.rate || "",
      category: serviceData?.category || "",
      city: serviceData?.city || "",
      pricingModel: serviceData?.pricingModel || "",
      images: serviceData?.images || [],
    },
  })

  // Initialize form with existing data
  useEffect(() => {
    if (serviceData) {
      form.setValue("title", serviceData.title ?? '');
      form.setValue("description", serviceData.description ?? '');
      form.setValue("rate", serviceData.rate ?? '');
      form.setValue("category", serviceData.category ?? '');
      form.setValue("city", serviceData.city ?? '');
      form.setValue("pricingModel", serviceData.pricingModel ?? '');
      
      // Set images if they exist
      if (serviceData.images && serviceData.images.length > 0) {
        setImages(serviceData.images);
      }
    }
  }, [serviceData, form]);

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

  // Mutation for creating/updating services
  const mutation = useMutation({
    mutationFn: async (formData) => {
      try {
        setUploading(true)
        
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
        
        const finalData = {
          ...formData,
          userId: user.userId,
          images: uploadedImagesArray,
        }

        return await createServiceRequirement(finalData)
      } catch (error) {
        console.error("Mutation error:", error)
        throw error
      } finally {
        setUploading(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      toast({
        title: serviceRequirementId ? "Service updated" : "Service created",
        description: "Your service has been submitted for approval.",
      })
      router.push('/app/buyer/my-services')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  async function onSubmit() {
    try {
      const data = form.getValues()
      mutation.mutate(data);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit service",
        variant: "destructive",
      });
    }
  }

  return (
    <><Toaster />
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(onSubmit, (errors) => {
            toast({
              title: "Error",
              description: Object.keys(errors)
                .map(key => `${key}: ${errors[key].message}`)
                .join(', '),
              variant: "destructive",
            });
          })()
        }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
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
                    <FormLabel>Service Description (Max. 200 words)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter service description"
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="absolute pl-2">PKR</span>
                          <Input className="pl-12" placeholder="0.00" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricingModel"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Per Hour">Per Hour</SelectItem>
                          <SelectItem value="Per Day">Per Day</SelectItem>
                          <SelectItem value="Per Job">Per Job</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}> 
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
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
                  Upload up to 6 images to showcase your service requirements
                </p>
              </FormItem>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={mutation.isPending || uploading}>
            {uploading ? "Uploading Images..." : mutation.isPending ? "Submitting..." : "Submit for Approval"}
          </Button>
        </form>
      </Form>
    </>
  )
}

