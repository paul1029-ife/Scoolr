"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, GraduationCap, School, Filter } from "lucide-react";
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

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all students by class
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <School className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{classes.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Average Attendance
              </p>
              <p className="text-2xl font-bold">93.5%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <Link
            href={`/dashboard/students/${cls.name
              .toLowerCase()
              .replace(" ", "-")}`}
            key={cls.name}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cls.armTeacher}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      {cls.averageAttendance}% Attendance
                    </Badge>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {cls.totalStudents} Students
                      </span>
                    </div>
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
