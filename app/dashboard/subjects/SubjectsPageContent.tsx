"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
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
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddSubjectModal from "./AddSubjectModal";
import Link from "next/link";
import { Metric, MetricGroup } from "@/components/common/metric";
import {
  EmptyState,
  PageBody,
  PageHeader,
} from "@/components/common/page-header";

import { removeSubject } from "@/lib/actions/subjects";
import { runAction } from "@/lib/actions/run-action";
import { useCan } from "@/components/auth/permissions-provider";
import { subjectLevelLabel, type SubjectListItem } from "@/types/subject";

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

  const teacherCount = new Set(
    subjects.map((s) => s.teacherName).filter(Boolean)
  ).size;

  return (
    <>
      <PageHeader
        title="Subjects"
        description="What is taught, and who teaches it"
        actions={
          canManage ? (
            <AddSubjectModal teachers={teachers} classRooms={classRooms} />
          ) : undefined
        }
      />
      <PageBody>
        <MetricGroup columns={3} className="mb-5">
          <Metric label="Subjects" value={subjects.length} />
          <Metric label="Teachers assigned" value={teacherCount} />
          <Metric label="Classes" value={classRooms.length} />
        </MetricGroup>

        {/* Improved search and filter */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects, teachers, or departments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter />
            Filters
          </Button>
        </div>

        {filteredSubjects.length === 0 ? (
          <Card>
            <EmptyState
              icon={BookOpen}
              title={
                subjects.length === 0
                  ? "No subjects yet"
                  : "No subjects match your search"
              }
              description={
                subjects.length === 0
                  ? "Add a subject to start building your timetable."
                  : "Try a different name, teacher or department."
              }
            />
          </Card>
        ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="group flex flex-col transition-colors duration-150 hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-2 px-4 py-3.5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {subject.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                    {subject.teacherName ?? "No teacher assigned"}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild disabled={!canManage}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletingId === subject.id || !canManage}
                      aria-label={`Delete ${subject.name}`}
                      className="shrink-0 opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete subject</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {subject.name}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex flex-wrap gap-1.5 px-4 pb-3.5">
                <Badge variant="secondary">{subject.department}</Badge>
                <Badge variant="outline">
                  {subjectLevelLabel[subject.level]}
                </Badge>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {subject.students}{" "}
                  {subject.students === 1 ? "student" : "students"}
                </span>
                <span className="flex min-w-0 items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {[subject.schedule, subject.time]
                      .filter(Boolean)
                      .join(" • ") || "Not timetabled"}
                  </span>
                </span>
              </div>

              <Link
                href={`/dashboard/subjects/${subject.id}`}
                className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                View subject
                <ChevronRight className="size-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Card>
          ))}
        </div>
        )}
      </PageBody>
    </>
  );
}

export default SubjectsPageContent;
