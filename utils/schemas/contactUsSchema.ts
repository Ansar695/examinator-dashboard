import { z } from "zod";

// Zod validation schema
export const contactUsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  subject: z.string({ message: "Subject is required" }),
  message: z.string({ message: "Message is required" }),
});
