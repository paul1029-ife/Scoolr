"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Metric, MetricGroup } from "@/components/common/metric";
import {
  EmptyState,
  PageBody,
  PageHeader,
} from "@/components/common/page-header";

import { SchoolLevel } from "@/lib/generated/prisma/enums";
import type { ClassRoomSummary } from "@/lib/queries/students";

export function StudentsPageContent({
  classRooms,
  totalStudents,
  averageAttendance,
}: {
  classRooms: ClassRoomSummary[];
  totalStudents: number;
  averageAttendance: number | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const matches = (cls: ClassRoomSummary) =>
    `${cls.name} ${cls.arm}`.toLowerCase().includes(searchTerm.toLowerCase());

  const juniorClasses = classRooms.filter(
    (cls) => cls.level === SchoolLevel.JUNIOR && matches(cls)
  );
  const seniorClasses = classRooms.filter(
    (cls) => cls.level === SchoolLevel.SENIOR && matches(cls)
  );

  return (
    <>
      <PageHeader
        title="Students"
        description="Classes and enrolment across your school"
        actions={
          <Button variant="outline">
            <BookOpen />
            Teacher roles
          </Button>
        }
      />

      <PageBody>
        <MetricGroup columns={3} className="mb-5">
          <Metric label="Total students" value={totalStudents} />
          <Metric label="Classes" value={classRooms.length} />
          <Metric
            label="Average attendance"
            value={
              averageAttendance === null
                ? "—"
                : `${averageAttendance.toFixed(1)}%`
            }
          />
        </MetricGroup>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search classes..."
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

        <ClassSection title="Junior school" classes={juniorClasses} />
        <ClassSection
          title="Senior school"
          classes={seniorClasses}
          className="mt-6"
        />
      </PageBody>
    </>
  );
}

function ClassSection({
  title,
  classes,
  className,
}: {
  title: string;
  classes: ClassRoomSummary[];
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-2.5 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {classes.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title={`No ${title.toLowerCase()} classes`}
            description="Classes you create for this level will appear here."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </section>
  );
}

function ClassCard({ cls }: { cls: ClassRoomSummary }) {
  const attendance = cls.averageAttendance;

  // Attendance bands: green is healthy, amber needs attention, and no data
  // stays neutral rather than being coloured as if it were a result.
  const attendanceVariant =
    attendance === null ? "secondary" : attendance >= 90 ? "success" : "warning";

  return (
    <Link
      href={`/dashboard/students/${cls.slug}`}
      className="group block rounded-lg"
    >
      <Card className="h-full transition-colors duration-150 group-hover:border-border-strong group-hover:bg-muted/30">
        <div className="flex items-start justify-between gap-3 px-4 py-3.5">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {[cls.name, cls.arm].filter(Boolean).join(" ")}
            </h3>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {cls.totalStudents}{" "}
              {cls.totalStudents === 1 ? "student" : "students"}
            </p>
          </div>
          <Badge dot variant={attendanceVariant} className="shrink-0">
            {attendance === null ? "No data" : `${attendance.toFixed(0)}%`}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5">
          <span className="truncate text-xs text-muted-foreground">
            {cls.formTeacherName ?? "No form teacher"}
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Card>
    </Link>
  );
}

export default StudentsPageContent;
