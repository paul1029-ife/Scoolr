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

export default function Page({
  //@ts-expect-error
  params,
}) {
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
    <div className="p-6 max-w-7xl mx-auto space-y-6" key={params.id}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/subjects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <p className="text-muted-foreground">Subject Details</p>
        </div>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-xl font-semibold">Overview</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">{subject.description}</p>

                <div className="grid grid-cols-2 gap-4 pt-4">
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

          <Card>
            <CardHeader className="border-b">
              <h2 className="text-xl font-semibold">Course Objectives</h2>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {subject.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-gray-100 rounded-full mt-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
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

          <Card>
            <CardHeader className="border-b">
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

          <Card>
            <CardHeader className="border-b">
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
