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
import { productSchema } from "@/lib/validations/product"
import { serviceSchema } from "@/lib/validations/service"
import { fetchService, createService, updateService, uploadToCloudinary } from "@/lib/api/service"
import { useToast } from "@/hooks/use-toast"
import { getUserDetails } from "@/lib/SessionManager"
import { Toaster } from "./ui/toaster"

const categories = ["Haircut", "Plumbing", "Carpentry", "Electrical", "Gardening", "Catering", "House Help", "Web Development", "Design", "Other"]

export function ServiceForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('id')
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const user = getUserDetails()

  // Fetch service data if editing
  const { data: serviceData } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => fetchService(serviceId),
    enabled: !!serviceId
  })

  const form = useForm({
    resolver: zodResolver(serviceSchema),
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
    if (serviceData?.images) {
      setFiles(serviceData.images)
      form.setValue("images", serviceData.images)
    }
    if (serviceData) {
      form.setValue("title", serviceData.title ?? '')
      form.setValue("description", serviceData.description ?? '')
      form.setValue("price", serviceData.rate ?? '')
      form.setValue("category", serviceData.category ?? '')
      form.setValue("city", serviceData.city ?? '')
      form.setValue("pricingModel", serviceData.pricingModel ?? '')
    }
  }, [serviceData, form])

  // Mutation for creating/updating services
  const mutation = useMutation({
    mutationFn: async (formData) => {
      try {
        setUploading(true)

        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            if (typeof file === 'string' || (file.url && typeof file.url === 'string')) {
              return { url: typeof file === 'string' ? file : file.url };
            }
            const url = await uploadToCloudinary(file);
            return { name: file.name, url: url };
          })
        );

        const finalData = {
          ...formData,
          userId: user.userId,
          images: uploadedImages,
        }

        if (serviceId) {
          return await updateService(serviceId, finalData)
        }
        return await createService(finalData)
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
        title: serviceId ? "Service updated" : "Service created",
        description: "Your service has been submitted for approval.",
      })
      router.push('/app/seller/my-services')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleFilesSelected = (newFiles) => {
    // Directly use the File objects
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      // Limit to 5 files
      if (updatedFiles.length > 5) {
        toast({
          title: "Error",
          description: "Maximum 5 images allowed",
          variant: "destructive",
        });
        return prevFiles;
      }
      return updatedFiles;
    });
  }

  const removeFile = (fileName) => {
    setFiles(prevFiles => 
      prevFiles.filter(file => 
        (file.name !== fileName) && 
        (typeof file === 'string' ? file !== fileName : true)
      )
    );
  }

  async function onSubmit() {
    try {
      console.log("Category before submission:", form.getValues().category);

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
          form.handleSubmit(onSubmit)()
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
                      <Input placeholder="Enter service title" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={field.value}>

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
              <div>
                <FormLabel>Upload Images</FormLabel>
                <ImageUpload onFilesSelected={handleFilesSelected} uploading={uploading} setUploading={setUploading} />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Uploading - {files.length}/5 files</div>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.name)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={mutation.isPending}>
            Submit for Approval
          </Button>
        </form>
      </Form>
    </>
  )
}



