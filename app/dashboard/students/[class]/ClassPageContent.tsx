"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TakeAttendanceModal } from "./TakeAttendanceModal";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { PageBody, PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { AddStudentModal } from "./AddStudentModal";

import {
  attendancePercentage,
  genderLabel,
  type Student,
} from "@/types/student";

export function ClassPageContent({
  classRoomId,
  className,
  students,
}: {
  classRoomId: string;
  className: string;
  students: Student[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <PageHeader
        title={className}
        description={`${students.length} ${
          students.length === 1 ? "student" : "students"
        } on the register`}
        backHref="/dashboard/students"
        backLabel="Back to classes"
        actions={
          <>
            <Button variant="outline">
              <Download />
              <span className="max-sm:sr-only">Export list</span>
            </Button>
            <AddStudentModal classRoomId={classRoomId} />
          </>
        }
      />

      <PageBody>
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration number..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter />
                Filters
              </Button>
              <TakeAttendanceModal
                classRoomId={classRoomId}
                students={students}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                    >
                      {students.length === 0
                        ? "No students in this class yet. Use “Add New Student” to enrol one."
                        : "No students match your search."}
                    </TableCell>
                  </TableRow>
                )}
                {filteredStudents.map((student) => {
                  const percentage = attendancePercentage(student.attendance);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.registrationNumber}</TableCell>
                      <TableCell>{genderLabel[student.gender]}</TableCell>
                      <TableCell>{student.guardianName ?? "—"}</TableCell>
                      <TableCell>{student.guardianPhone ?? "—"}</TableCell>
                      <TableCell>
                        {percentage === null ? (
                          <span className="text-sm text-muted-foreground">
                            Not recorded
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={getAttendanceColor(percentage)}>
                              {percentage.toFixed(1)}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({student.attendance.present}/
                              {student.attendance.total})
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {percentage === null ? (
                          <Badge variant="secondary">No data</Badge>
                        ) : percentage >= 75 ? (
                          <Badge dot variant="success">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Good Standing
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Poor Attendance
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </PageBody>
    </>
  );
}

export default ClassPageContent;
