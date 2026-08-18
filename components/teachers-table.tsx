"use client";

import { useTeachers } from "@/context/teachers-context";
import {
  TeacherStatus,
  classRoomLabel,
  teacherStatusLabel,
} from "@/types/teacher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/page-header";

interface TeachersTableProps {
  onEdit: (teacherId: string) => void;
}

export function TeachersTable({ onEdit }: TeachersTableProps) {
  const { filteredTeachers, removeTeacher, teachers } = useTeachers();

  if (filteredTeachers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={
          teachers.length === 0 ? "No teachers yet" : "No teachers match your filters"
        }
        description={
          teachers.length === 0
            ? "Add a member of staff to see them listed here."
            : "Try a different name or clear the status filter."
        }
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Class</TableHead>
          {/* Contact is the first thing to go on a narrow screen: the row is
              still identifiable and actionable without it. */}
          <TableHead className="hidden lg:table-cell">Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTeachers.map((teacher) => (
          <TableRow key={teacher.id} className="group">
            <TableCell className="font-medium text-foreground">
              {teacher.name}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {teacher.subject}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {classRoomLabel(teacher.classRoom)}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <span className="block text-[13px] text-foreground">
                {teacher.phoneNumber}
              </span>
              <span className="block text-xs text-muted-foreground">
                {teacher.email}
              </span>
            </TableCell>
            <TableCell>
              <Badge
                dot
                variant={
                  teacher.status === TeacherStatus.ACTIVE ? "success" : "warning"
                }
              >
                {teacherStatusLabel[teacher.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    // Revealed on hover, but always present for keyboard users.
                    className="opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onEdit(teacher.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => removeTeacher(teacher.id)}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
