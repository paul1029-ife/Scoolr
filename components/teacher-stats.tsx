"use client";

import { useTeachers } from "@/context/teachers-context";
import SimpleCard from "./common/simple-card";

export function TeacherStats() {
  const { teachers } = useTeachers();

  const activeTeachers = teachers.filter((t) => t.status === "active").length;
  const onLeaveTeachers = teachers.filter(
    (t) => t.status === "on leave"
  ).length;

  const stats = [
    {
      title: "Total Teachers",
      value: teachers.length,
    },
    {
      title: "Active Teachers",
      value: activeTeachers,
    },
    {
      title: "On Leave",
      value: onLeaveTeachers,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <SimpleCard
          key={stat.title}
          title={stat.title}
          value={stat.value.toString()}
        />
      ))}
    </div>
  );
}
