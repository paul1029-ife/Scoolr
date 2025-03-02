"use client";

import { useTeachers } from "@/context/teachers-context";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Clock } from "lucide-react";

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
      icon: <Users className="h-5 w-5 text-blue-700" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      title: "Active Teachers",
      value: activeTeachers,
      icon: <CheckCircle className="h-5 w-5 text-green-700" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    {
      title: "On Leave",
      value: onLeaveTeachers,
      icon: <Clock className="h-5 w-5 text-orange-700" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm bg-gray-100">
          <CardContent className="flex items-center gap-4 p-4 md:p-6">
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-md font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
