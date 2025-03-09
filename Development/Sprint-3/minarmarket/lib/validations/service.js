import * as z from "zod"

export const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
  rate: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  pricingModel: z.string().min(1, "Please select a pricing model").nonempty({
    required_error: "Please select a pricing model",
  }),
  category: z.string().min(1, "Please select a service category"),
  city: z.string().min(1, "Please select your city"),
  images: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
      })
    )
    .max(5, "Maximum 5 images allowed"),
})

export const serviceFormSchema = serviceSchema.extend({
  images: z.array(z.object({
    url: z.string(),
    name: z.string(),
  })).default([])
})