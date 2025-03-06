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
  ArrowLeft,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { studentsData } from "./data";
import { AddStudentModal, Student } from "./AddStudentModal";
import { useParams } from "next/navigation";

export default function ClassPage() {
  const params = useParams<{ class: string }>();
  console.log("Params", params);
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState("");
  const className = params.class.replace("-", " ").toUpperCase();

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleUpdateAttendance = (attendanceData: {
    date: Date;
    attendance: Record<string, boolean>;
  }) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        const wasPresent = attendanceData.attendance[student.id];
        return {
          ...student,
          attendance: {
            present: student.attendance.present + (wasPresent ? 1 : 0),
            total: student.attendance.total + 1,
          },
        };
      })
    );
  };

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
    <div key={params.class} className="mx-auto space-y-8">
      {/* Header Section */}
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky  top-0 py-2 items-center justify-between z-10">
        <div className="flex justify-center items-center gap-2">
          <Link href="/dashboard/students">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-md text-gray-800 font-medium tracking-tight">
            {className}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export List
          </Button>
          <AddStudentModal onAddStudent={handleAddStudent} />
        </div>
      </div>

      <Card className="mx-3 bg-gray-100">
        <CardHeader className="border-b ">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or registration number..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <TakeAttendanceModal
                students={students}
                onUpdateAttendance={handleUpdateAttendance}
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
                {filteredStudents.map((student) => {
                  const attendancePercentage =
                    (student.attendance.present / student.attendance.total) *
                    100;
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.registrationNumber}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.guardianName}</TableCell>
                      <TableCell>{student.guardianPhone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={getAttendanceColor(attendancePercentage)}
                          >
                            {attendancePercentage.toFixed(1)}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({student.attendance.present}/
                            {student.attendance.total})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {attendancePercentage >= 75 ? (
                          <Badge className="bg-green-100 text-green-700">
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
    </div>
  );
}
