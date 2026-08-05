import { z } from "zod";

import { TeacherStatus } from "@/lib/generated/prisma/enums";

export { TeacherStatus };

export const teacherFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  classRoomId: z.string().min(1, "Select a class"),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9\s-]{10,}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  status: z.nativeEnum(TeacherStatus),
});

export type TeacherFormData = z.infer<typeof teacherFormSchema>;

export type ClassRoomOption = {
  id: string;
  name: string;
  arm: string;
};

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  phoneNumber: string;
  email: string;
  status: TeacherStatus;
  classRoomId: string | null;
  classRoom: ClassRoomOption | null;
};

/** "JSS 1" for a single-arm class, "JSS 1 A" when the school runs arms. */
export function classRoomLabel(classRoom: ClassRoomOption | null): string {
  if (!classRoom) return "—";
  return classRoom.arm ? `${classRoom.name} ${classRoom.arm}` : classRoom.name;
}

export const teacherStatusLabel: Record<TeacherStatus, string> = {
  [TeacherStatus.ACTIVE]: "Active",
  [TeacherStatus.ON_LEAVE]: "On Leave",
};
