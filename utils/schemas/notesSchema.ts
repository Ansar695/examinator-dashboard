import { z } from "zod"

// Zod schema
export const addNotesSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  boardId: z.string().nonempty("Please select a board"),
  classId: z.string().nonempty("Please select a class"),
  userType: z.enum(["student", "teacher", "other"], {
    required_error: "Please select a user type",
  }),
  file: z.string().nonempty("Please upload a PDF file"),
});

export type AddNoteFormData = z.infer<typeof addNotesSchema>
