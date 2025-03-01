"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Users,
  GraduationCap,
  School,
  Filter,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface ClassData {
  name: string;
  totalStudents: number;
  averageAttendance: number;
  armTeacher: string;
}

// Sample data
const classes: ClassData[] = [
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

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");

  const totalStudents = classes.reduce(
    (sum, classData) => sum + classData.totalStudents,
    0
  );

  const averageAttendance = (
    classes.reduce((sum, cls) => sum + cls.averageAttendance, 0) /
    classes.length
  ).toFixed(1);

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-100">
      {/* Header with action button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Students
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all students by class
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Class
        </Button>
      </div>

      {/* Stats cards with more emphasis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 md:p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground">
                Total Students
              </p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 md:p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <School className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground">
                Total Classes
              </p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 md:p-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <GraduationCap className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground">
                Average Attendance
              </p>
              <p className="text-2xl font-bold">{averageAttendance}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improved search and filter */}
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

      {/* Class cards with improved visual hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredClasses.map((cls) => (
          <Link
            href={`/dashboard/students/${cls.name
              .toLowerCase()
              .replace(" ", "-")}`}
            key={cls.name}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cls.name}
                    </h3>
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
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {cls.totalStudents} Students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-600">
                      Teacher: {cls.armTeacher}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
