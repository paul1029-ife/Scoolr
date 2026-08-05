"use client";

import React, { useState } from "react";
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
  Users,
  Clock,
  Filter,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddSubjectModal from "./AddSubjectModal";
import Link from "next/link";
import SimpleCard from "@/components/common/simple-card";

import { removeSubject } from "@/lib/actions/subjects";
import { runAction } from "@/lib/actions/run-action";
import { useCan } from "@/components/auth/permissions-provider";
import {
  subjectLevelLabel,
  type SubjectLevel,
  type SubjectListItem,
} from "@/types/subject";

const DEPARTMENT_COLORS: Record<string, string> = {
  Humanities: "bg-emerald-100 text-emerald-800",
  Sciences: "bg-purple-100 text-purple-800",
  "Religious Studies": "bg-amber-100 text-amber-800",
};

const LEVEL_COLORS: Record<string, string> = {
  SENIOR: "bg-blue-50 text-blue-700 border-blue-200",
  JUNIOR: "bg-pink-50 text-pink-700 border-pink-200",
  ALL_LEVELS: "bg-gray-50 text-gray-700 border-gray-200",
};

export function SubjectsPageContent({
  subjects,
  teachers,
  classRooms,
}: {
  subjects: SubjectListItem[];
  teachers: { id: string; name: string }[];
  classRooms: { id: string; name: string; arm: string }[];
}) {
  const { toast } = useToast();
  const canManage = useCan("subject:manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteSubject = async (subjectId: string) => {
    setDeletingId(subjectId);
    const result = await runAction(() => removeSubject(subjectId));
    setDeletingId(null);

    if (!result.ok) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subject Deleted",
      description: "The subject has been successfully removed.",
    });
  };

  const query = searchTerm.toLowerCase();
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(query) ||
      (subject.teacherName ?? "").toLowerCase().includes(query) ||
      subject.department.toLowerCase().includes(query)
  );

  const getDepartmentColor = (department: string) =>
    DEPARTMENT_COLORS[department] ?? "bg-blue-100 text-blue-800";

  const getLevelColor = (level: SubjectLevel) =>
    LEVEL_COLORS[level] ?? "bg-gray-50 text-gray-700 border-gray-200";

  const teacherCount = new Set(
    subjects.map((s) => s.teacherName).filter(Boolean)
  ).size;

  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky  top-0 py-2 items-center justify-between z-10">
        <div>
          <h1 className="text-md font-medium tracking-tight">
            Manage Subjects
          </h1>
        </div>
        {canManage && (
          <AddSubjectModal teachers={teachers} classRooms={classRooms} />
        )}
      </div>
      <div className="px-3">
        {/* Stats cards with more emphasis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <SimpleCard title="Total Subjects" value={`${subjects.length}`} />
          <SimpleCard title="Teachers Assigned" value={`${teacherCount}`} />
          <SimpleCard title="Total Classes" value={`${classRooms.length}`} />
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

        {filteredSubjects.length === 0 && (
          <p className="text-sm text-muted-foreground py-10 text-center">
            {subjects.length === 0
              ? "No subjects yet. Use “Add New Subject” to create one."
              : "No subjects match your search."}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredSubjects.map((subject) => (
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
                    <AlertDialogTrigger asChild disabled={!canManage}>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={deletingId === subject.id || !canManage}
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
                      {subject.teacherName ?? "No teacher assigned"}
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
                      {subjectLevelLabel[subject.level]}
                    </Badge>
                  </div>

                  {/* Stats and Link */}
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {subject.students}{" "}
                        {subject.students === 1 ? "Student" : "Students"}
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
                        {[subject.schedule, subject.time]
                          .filter(Boolean)
                          .join(" • ") || "Not timetabled"}
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

export default SubjectsPageContent;
