"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, Clock, Filter } from "lucide-react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");

  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      department: "Sciences",
      teacher: "Dr. Sarah Johnson",
      students: 125,
      level: "Senior",
      schedule: "Mon, Wed, Fri",
      time: "9:00 AM - 10:30 AM",
      color: "bg-blue-100",
    },
    {
      id: 2,
      name: "English Literature",
      department: "Humanities",
      teacher: "Mr. James Wilson",
      students: 98,
      level: "Senior",
      schedule: "Tue, Thu",
      time: "11:00 AM - 12:30 PM",
      color: "bg-green-100",
    },
    {
      id: 3,
      name: "Physics",
      department: "Sciences",
      teacher: "Mrs. Linda Chen",
      students: 85,
      level: "Senior",
      schedule: "Mon, Wed, Fri",
      time: "1:00 PM - 2:30 PM",
      color: "bg-purple-100",
    },
    {
      id: 4,
      name: "Bible Studies",
      department: "Religious Studies",
      teacher: "Rev. Michael Thomas",
      students: 150,
      level: "All Levels",
      schedule: "Tue, Thu",
      time: "8:00 AM - 9:30 AM",
      color: "bg-yellow-100",
    },
  ];

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all subjects
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Subject
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects, teachers, or departments..."
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-2xl font-bold">{subjects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold">
                {new Set(subjects.map((s) => s.teacher)).size}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Classes</p>
              <p className="text-2xl font-bold">{subjects.length * 2}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.teacher}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{subject.department}</Badge>
                    <Badge variant="outline">{subject.level}</Badge>
                  </div>
                </div>
                <div className={`${subject.color} p-3 rounded-full`}>
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{subject.students} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {subject.schedule} • {subject.time}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
