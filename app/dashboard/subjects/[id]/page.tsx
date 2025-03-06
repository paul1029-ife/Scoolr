/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Building2,
  BookOpen,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ id: string }>();
  const subject = {
    id: 2,
    name: "English Literature",
    department: "Humanities",
    teacher: "Mr. James Wilson",
    students: 98,
    level: "Senior",
    schedule: "Tue, Thu",
    time: "11:00 AM - 12:30 PM",
    description:
      "Advanced study of classic and contemporary literature, focusing on critical analysis and interpretation of texts.",
    room: "Room 204",
    semester: "Fall 2024",
    prerequisites: ["Basic Literature", "Creative Writing"],
    materials: ["Norton Anthology of English Literature", "Writing Handbook"],
    objectives: [
      "Develop critical reading and analysis skills",
      "Enhance writing capabilities through varied assignments",
      "Understand different literary periods and movements",
      "Master literary devices and their applications",
    ],
  };

  return (
    <div key={params.id} className="container mx-auto space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="border-b px-4 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-3 items-center justify-between z-10">
        <div className="flex justify-center items-center gap-2">
          <Link href="/dashboard/subjects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-md text-gray-800 font-medium tracking-tight">
            {subject.name}
          </h1>
        </div>

        <Button className="flex items-center gap-2 bg-blue-600">
          <Edit className="h-4 w-4" />
          Edit Subject
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-100 shadow-sm">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl font-semibold">Overview</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">{subject.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{subject.students}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium">{subject.room}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-medium">{subject.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{subject.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 shadow-sm">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl font-semibold">Course Objectives</h2>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {subject.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-gray-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          <Card className="bg-gray-100 shadow-sm">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl font-semibold">Subject Information</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Teacher</p>
                <p className="font-medium">{subject.teacher}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <Badge variant="secondary">{subject.department}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <Badge variant="outline">{subject.level}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Semester</p>
                <p className="font-medium">{subject.semester}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 shadow-sm">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl font-semibold">Course Materials</h2>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {subject.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-100 shadow-sm">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl font-semibold">Prerequisites</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {subject.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="secondary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {prereq}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
