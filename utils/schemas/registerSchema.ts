import { z } from "zod";

// Zod validation schema
export const registrationSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  userType: z.enum(["student", "teacher", "other"], {
    required_error: "Please select a user type",
  }),
  institutionName: z.string().optional(),
  age: z.coerce.number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  profilePicture: z.string().url("Invalid image URL").optional().or(z.literal("")),
  institutionLogo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
}).refine((data) => {
  if (data.userType !== "student" && !data.institutionName) {
    return false;
  }
  return true;
}, {
  message: "Institution name is required for teachers and other user types",
  path: ["institutionName"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const addUserSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  userType: z.enum(["student", "teacher", "other"], {
    required_error: "Please select a user type",
  }),
  institutionName: z.string().optional(),
  age: z.coerce.number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  profilePicture: z.string().url("Invalid image URL").optional().or(z.literal("")),
  institutionLogo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
}).refine((data) => {
  if (data.userType !== "student" && !data.institutionName) {
    return false;
  }
  return true;
}, {
  message: "Institution name is required for teachers and other user types",
  path: ["institutionName"],
})