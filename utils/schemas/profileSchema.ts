import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Invalid phone number"
    ),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than 100"),
  institutionName: z
    .string()
    .min(2, "Institution name must be at least 2 characters"),
  profilePicture: z.string().optional(),
  institutionLogo: z.string().optional(),
});