"use client"

import { useTeachers } from "@/context/teachers-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TeacherStats() {
  const { teachers } = useTeachers()

  const activeTeachers = teachers.filter((t) => t.status === "active").length
  const onLeaveTeachers = teachers.filter((t) => t.status === "on leave").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{teachers.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{activeTeachers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>On Leave</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{onLeaveTeachers}</p>
        </CardContent>
      </Card>
    </div>
  )
}

