import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBody, PageHeader } from "@/components/common/page-header";
import {
  Users,
  Clock,
  GraduationCap,
  Calendar,
  Building2,
  BookOpen,
  Edit,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getSubjectById } from "@/lib/queries/subjects";
import { subjectLevelLabel } from "@/types/subject";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // This page previously rendered one hardcoded subject regardless of the id.
  const subject = await getSubjectById(id);

  if (!subject) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={subject.name}
        description={subject.department}
        backHref="/dashboard/subjects"
        backLabel="Back to subjects"
        actions={
          <Button variant="outline">
            <Edit />
            Edit subject
          </Button>
        }
      />

      <PageBody className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column (2/3 width on large screens) */}
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Overview</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {subject.description ?? "No description added yet."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{subject.students}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Room</p>
                      <p className="font-medium">{subject.room ?? "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule</p>
                      <p className="font-medium">
                        {subject.schedule ?? "Not timetabled"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Clock className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{subject.time ?? "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Course Objectives</h2>
            </CardHeader>
            <CardContent className="p-6">
              {subject.objectives.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No objectives added yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {subject.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-muted p-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Subject Information</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Teacher</p>
                <p className="font-medium">
                  {subject.teacherName ?? "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <Badge variant="secondary">{subject.department}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <Badge variant="outline">
                  {subjectLevelLabel[subject.level]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{subject.className ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="font-medium">{subject.termName ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Course Materials</h2>
            </CardHeader>
            <CardContent className="p-6">
              {subject.materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No materials added yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {subject.materials.map((material, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Prerequisites</h2>
            </CardHeader>
            <CardContent className="p-6">
              {subject.prerequisites.length === 0 ? (
                <p className="text-sm text-muted-foreground">None.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {subject.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="secondary">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {prereq}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
