"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";
import Link from "next/link";
import SimpleCard from "@/components/common/simple-card";

import { SchoolLevel } from "@/lib/generated/prisma/enums";
import type { ClassRoomSummary } from "@/lib/queries/students";

export function StudentsPageContent({
  classRooms,
  totalStudents,
  averageAttendance,
}: {
  classRooms: ClassRoomSummary[];
  totalStudents: number;
  averageAttendance: number | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const matches = (cls: ClassRoomSummary) =>
    `${cls.name} ${cls.arm}`.toLowerCase().includes(searchTerm.toLowerCase());

  const juniorClasses = classRooms.filter(
    (cls) => cls.level === SchoolLevel.JUNIOR && matches(cls)
  );
  const seniorClasses = classRooms.filter(
    (cls) => cls.level === SchoolLevel.SENIOR && matches(cls)
  );

  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-md font-medium tracking-tight">Manage Students</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <BookOpen className="h-4 w-4 mr-2" />
          Teacher roles
        </Button>
      </div>

      <div className="px-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <SimpleCard title="Total Students" value={`${totalStudents}`} />
          <SimpleCard title="Total Classes" value={`${classRooms.length}`} />
          <SimpleCard
            title="Average Attendance"
            value={
              averageAttendance === null
                ? "—"
                : `${averageAttendance.toFixed(1)}%`
            }
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search classes..."
              className="pl-10 py-2 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-700 border-gray-300"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Junior School Section */}
        <h2 className="text-lg text-gray-900 mb-3">Junior School</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {juniorClasses.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>

        {/* Senior School Section */}
        <h2 className="text-lg text-gray-900 mt-6 mb-3">Senior School</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {seniorClasses.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassCard({ cls }: { cls: ClassRoomSummary }) {
  const attendance = cls.averageAttendance;

  return (
    <Link href={`/dashboard/students/${cls.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="px-4 py-3 bg-gray-200 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-md text-gray-900">
                {[cls.name, cls.arm].filter(Boolean).join(" ")}
              </h3>
              <Badge
                variant="secondary"
                className={`px-2 py-1 text-xs font-medium ${
                  attendance === null
                    ? "bg-gray-100 text-gray-600"
                    : attendance >= 95
                    ? "bg-green-100 text-green-800"
                    : attendance >= 90
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {attendance === null
                  ? "No attendance yet"
                  : `${attendance.toFixed(0)}% Attendance`}
              </Badge>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm font-medium">
              {cls.totalStudents} {cls.totalStudents === 1 ? "Student" : "Students"}
            </p>
            <p className="text-sm text-gray-600">
              Teacher: {cls.formTeacherName ?? "Unassigned"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default StudentsPageContent;
