/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  Filter,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddSubjectModal from "./AddSubjectModal";
import Link from "next/link";

interface Subject {
  id: number;
  name: string;
  teacher: string;
  department: string;
  level: string;
  students: number;
  schedule: string;
  time: string;
  color: string;
}

const initialSubjects: Subject[] = [
  {
    id: 8,
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
    id: 123,
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
    id: 329,
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

export default function Page() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState([]);

  const handleSubjectAdded = () => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    setSubjects(storedSubjects);
  };

  const loadSubjects = () => {
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    //@ts-expect-error
    setSubjects([...initialSubjects, ...storedSubjects]);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleDeleteSubject = (subjectId: number) => {
    try {
      const updatedSubjects = subjects.filter(
        (subject: Subject) => subject.id !== subjectId
      );
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
      setSubjects(updatedSubjects);
      toast({
        title: "Subject Deleted",
        description: "The subject has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  const filteredSubjects = subjects.filter(
    (subject: Subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDepartmentColor = (department: string) => {
    const colors = {
      Humanities: "bg-emerald-100 text-emerald-800",
      Sciences: "bg-purple-100 text-purple-800",
      "Religious Studies": "bg-amber-100 text-amber-800",
    };
    //@ts-expect-error
    return colors[department] || "bg-blue-100 text-blue-800";
  };

  const getLevelColor = (level: string) => {
    const colors = {
      Senior: "bg-blue-50 text-blue-700 border-blue-200",
      Junior: "bg-pink-50 text-pink-700 border-pink-200",
      "All Levels": "bg-gray-50 text-gray-700 border-gray-200",
    };
    //@ts-expect-error
    return colors[level] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky  top-0 py-2 items-center justify-between z-10">
        <div>
          <h1 className="text-md font-medium tracking-tight">
            Manage Subjects
          </h1>
        </div>
        <AddSubjectModal onSubjectAdded={handleSubjectAdded} />
      </div>
      <div className="px-3">
        {/* Stats cards with more emphasis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Total Subjects
                </p>
                <p className="text-xl font-medium">{subjects.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold">
                  {new Set(subjects.map((s: Subject) => s.teacher)).size}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Active Classes
                </p>
                <p className="text-2xl font-bold">{subjects.length * 2}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Improved search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subjects, teachers, or departments..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredSubjects.map((subject: Subject) => (
            <Card
              className="hover:shadow-md transition-shadow border-0 shadow-sm overflow-hidden"
              key={subject.id}
            >
              <CardContent className="p-0">
                {/* Card Header */}
                <div className="p-4 bg-gray-100 border-b flex items-center justify-between">
                  <h3 className="text-md text-gray-900 truncate">
                    {subject.name}
                  </h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {subject.name}? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Teacher Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium">
                      {subject.teacher}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={`px-2 py-1 ${getDepartmentColor(
                        subject.department
                      )}`}
                    >
                      {subject.department}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 ${getLevelColor(subject.level)}`}
                    >
                      {subject.level}
                    </Badge>
                  </div>

                  {/* Stats and Link */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {subject.students} Students
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/subjects/${subject.id}`}
                      className="flex items-center hover:bg-gray-50 p-2 -mx-2 rounded-md transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 group-hover:bg-blue-100">
                        <Clock className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 mr-1 group-hover:text-blue-600">
                        {subject.schedule} • {subject.time}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
