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
import { fetchProduct, createProduct, updateProduct, uploadToCloudinary } from "@/lib/api/product"
import { useToast } from "@/hooks/use-toast"
import { getUserDetails } from "@/lib/SessionManager"
import { Toaster } from "./ui/toaster"


const categories = ['Electronics', 'Clothing', 'Books', 'Other']

export function ProductForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const user = getUserDetails()

  // Fetch product data if editing
  const { data: productData } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId
  })
  
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: productData?.title || "",
      description: productData?.description || "",
      price: productData?.price || "",
      category: productData?.category || "",
      images: productData?.images || [],
    },

  })

  // Initialize files state with existing images if editing
  useEffect(() => {
    if (productData?.images) {
      setFiles(productData.images)
      form.setValue("images", productData.images)
    }
    if (productData)
    {
      form.setValue("title", productData.title??'')
      form.setValue("description", productData.description??'')
      form.setValue("price", productData.price??'')
      form.setValue("category", productData.category??'')
    }
  }, [productData, form])

  
  // Mutations for creating/updating products
  const mutation = useMutation({
    mutationFn: async (formData) => {
      try {
        setUploading(true)
        
        // Handle file uploads first
        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            // Check if the file is already an uploaded image URL
            if (typeof file === 'string' || (file.url && typeof file.url === 'string')) {
              return { url: typeof file === 'string' ? file : file.url };
            }
            const url = await uploadToCloudinary(file);
            return {
              name:file.name,url: url };
          })
        );

        // Prepare final data for submission
        const finalData = {
          ...formData,
          userId: user.userId,
          images: uploadedImages,
        }

        if (productId) {
          return await updateProduct(productId, finalData)
        }
        return await createProduct(finalData)
      } catch (error) {
        console.error("Mutation error:", error)
        throw error
      } finally {
        setUploading(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast({
        title: productId ? "Product updated" : "Product created",
        description: "Your product has been submitted for approval.",
      })
      router.push('/app/seller/my-products')
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

  async function onSubmit(data) {
    try {
      if (files.length === 0) {
        toast({
          title: "Error",
          description: "Please upload at least one image",
          variant: "destructive",
        });
        return;
      }

      mutation.mutate(data);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit product",
        variant: "destructive",
      });
    }
  }

  const removeFile = (fileName) => {
    setFiles(prevFiles => 
      prevFiles.filter(file => 
        (file.name !== fileName) && 
        (typeof file === 'string' ? file !== fileName : true)
      )
    );
  }

  return (
    <><Toaster/><Form {...form}>
      <form onSubmit={(e)=>{e.preventDefault()
        console.log("Form data before submission:", form.getValues())
       onSubmit(form.getValues())
      }
        } className="space-y-8">
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

        <Button type="submit"
          // onClick={form.handleSubmit(onSubmit)}
        className="w-full md:w-auto" disabled={mutation.isPending}>
          Submit for Approval
        </Button>
      </form>
    </Form>
    </>
    
  )
}

