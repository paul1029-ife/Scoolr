"use client";

import { useTeachers } from "@/context/teachers-context";
import { TeacherStatus } from "@/types/teacher";
import { Metric, MetricGroup } from "./common/metric";

export function TeacherStats() {
  const { teachers } = useTeachers();

  const activeTeachers = teachers.filter(
    (t) => t.status === TeacherStatus.ACTIVE
  ).length;
  const onLeaveTeachers = teachers.filter(
    (t) => t.status === TeacherStatus.ON_LEAVE
  ).length;

  return (
    <MetricGroup columns={3}>
      <Metric label="Total teachers" value={teachers.length} />
      <Metric label="Active" value={activeTeachers} />
      <Metric label="On leave" value={onLeaveTeachers} />
    </MetricGroup>
  );
}
