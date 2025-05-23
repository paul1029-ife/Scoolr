"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";
import Link from "next/link";
import SimpleCard from "@/components/common/simple-card";

interface ClassData {
  name: string;
  totalStudents: number;
  averageAttendance: number;
  armTeacher: string;
}

// Junior School Classes
const juniorClasses: ClassData[] = [
  {
    name: "JSS 1",
    totalStudents: 120,
    averageAttendance: 95,
    armTeacher: "Mrs. Adebayo",
  },
  {
    name: "JSS 2",
    totalStudents: 115,
    averageAttendance: 92,
    armTeacher: "Mr. Okonkwo",
  },
  {
    name: "JSS 3",
    totalStudents: 108,
    averageAttendance: 94,
    armTeacher: "Mrs. Okafor",
  },
];

// Senior School Classes
const seniorClasses: ClassData[] = [
  {
    name: "SSS 1",
    totalStudents: 98,
    averageAttendance: 91,
    armTeacher: "Mr. Nnamdi",
  },
  {
    name: "SSS 2",
    totalStudents: 95,
    averageAttendance: 93,
    armTeacher: "Mrs. Eze",
  },
  {
    name: "SSS 3",
    totalStudents: 90,
    averageAttendance: 96,
    armTeacher: "Mr. Olawale",
  },
];

// Combine all classes for calculations
const allClasses = [...juniorClasses, ...seniorClasses];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");

  const totalStudents = allClasses.reduce(
    (sum, classData) => sum + classData.totalStudents,
    0
  );
  const averageAttendance = (
    allClasses.reduce((sum, cls) => sum + cls.averageAttendance, 0) /
    allClasses.length
  ).toFixed(1);

  const filteredJuniorClasses = juniorClasses.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSeniorClasses = seniorClasses.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <SimpleCard title="Total Classes" value="20" />
          <SimpleCard
            title="Average Attendance"
            value={`${averageAttendance}%`}
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
          {filteredJuniorClasses.map((cls) => (
            <ClassCard key={cls.name} cls={cls} />
          ))}
        </div>

        {/* Senior School Section */}
        <h2 className="text-lg text-gray-900 mt-6 mb-3">Senior School</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredSeniorClasses.map((cls) => (
            <ClassCard key={cls.name} cls={cls} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassCard({ cls }: { cls: ClassData }) {
  return (
    <Link
      href={`/dashboard/students/${cls.name.toLowerCase().replace(" ", "-")}`}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="px-4 py-3 bg-gray-200 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-md text-gray-900">{cls.name}</h3>
              <Badge
                variant="secondary"
                className={`px-2 py-1 text-xs font-medium ${
                  cls.averageAttendance >= 95
                    ? "bg-green-100 text-green-800"
                    : cls.averageAttendance >= 90
                    ? "bg-blue-100 text-blue-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {cls.averageAttendance}% Attendance
              </Badge>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm font-medium">{cls.totalStudents} Students</p>
            <p className="text-sm text-gray-600">Teacher: {cls.armTeacher}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
