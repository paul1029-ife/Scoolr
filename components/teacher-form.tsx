"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  TeacherStatus,
  classRoomLabel,
  teacherFormSchema,
  teacherStatusLabel,
  type Teacher,
  type TeacherFormData,
} from "@/types/teacher"
import { useTeachers } from "@/context/teachers-context"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeacherFormProps {
  teacher?: Teacher
  onClose: () => void
}

export function TeacherForm({ teacher, onClose }: TeacherFormProps) {
  const { addTeacher, updateTeacher, classRooms, isPending } = useTeachers()

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: teacher
      ? {
          name: teacher.name,
          subject: teacher.subject,
          classRoomId: teacher.classRoomId ?? "",
          phoneNumber: teacher.phoneNumber,
          email: teacher.email,
          status: teacher.status,
        }
      : {
          name: "",
          subject: "",
          classRoomId: classRooms[0]?.id ?? "",
          phoneNumber: "",
          email: "",
          status: TeacherStatus.ACTIVE,
        },
  })

  const onSubmit = async (data: TeacherFormData) => {
    const saved = teacher
      ? await updateTeacher(teacher.id, data)
      : await addTeacher(data)

    // Keep the dialog open on failure so the entered details aren't lost.
    if (!saved) return

    form.reset()
    onClose()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter subject" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classRoomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Assigned</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classRooms.map((classRoom) => (
                    <SelectItem key={classRoom.id} value={classRoom.id}>
                      {classRoomLabel(classRoom)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="+234 XXX XXX XXXX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="email@school.edu.ng" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TeacherStatus.ACTIVE}>
                    {teacherStatusLabel[TeacherStatus.ACTIVE]}
                  </SelectItem>
                  <SelectItem value={TeacherStatus.ON_LEAVE}>
                    {teacherStatusLabel[TeacherStatus.ON_LEAVE]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        </div>

        <div className="shrink-0 border-t bg-white px-6 py-4">
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isPending
                ? "Saving..."
                : `${teacher ? "Update" : "Add"} Teacher`}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

