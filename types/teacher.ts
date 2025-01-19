import { z } from "zod"

export const teacherSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  classAssigned: z.enum(["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]),
  phoneNumber: z.string().regex(/^\+?[0-9\s-]{10,}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["active", "on leave"]),
})

export const teacherFormSchema = teacherSchema.omit({ id: true })

export type Teacher = z.infer<typeof teacherSchema>
export type TeacherFormData = z.infer<typeof teacherFormSchema>

