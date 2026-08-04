"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeachers } from "@/context/teachers-context"
import { TeacherStatus, teacherStatusLabel } from "@/types/teacher"

export function SearchFilters() {
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useTeachers()

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Filter Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={TeacherStatus.ACTIVE}>
            {teacherStatusLabel[TeacherStatus.ACTIVE]}
          </SelectItem>
          <SelectItem value={TeacherStatus.ON_LEAVE}>
            {teacherStatusLabel[TeacherStatus.ON_LEAVE]}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

