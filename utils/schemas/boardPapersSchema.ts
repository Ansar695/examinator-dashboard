import { z } from "zod"

// Zod schema
export const boardPaperaSchema = z.object({
  boardName: z.string().min(3, "Title must be at least 3 characters"),
  boardYear: z.string().nonempty("Please select a board"),
  paperFile: z.string().nonempty("Please select a class"),
});

export type AddNoteFormData = z.infer<typeof boardPaperaSchema>
