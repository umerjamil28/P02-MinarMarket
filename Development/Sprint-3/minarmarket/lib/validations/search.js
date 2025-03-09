import * as z from "zod"

export const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term"),
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

