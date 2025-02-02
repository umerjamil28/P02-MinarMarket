import * as z from "zod"

export const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(1, "Product description is required").max(200, "Description cannot exceed 200 words"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  category: z.string().min(1, "Please select a category"),
  images: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
      }),
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
})

export const requirementSchema = z.object({
  title: z.string().min(1, "Requirement title is required"),
  description: z.string().min(1, "Requirement description is required").max(200, "Description cannot exceed 200 words"),
  category: z.string().min(1, "Please select a category"),
  images: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
      }),
    )
    // .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
})


