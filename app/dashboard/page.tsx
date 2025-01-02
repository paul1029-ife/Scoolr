"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Bell,
  Calendar,
  BookOpen,
  Clock,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  // Sample attendance data for the chart
  const attendanceData = [
    { name: "Mon", attendance: 96 },
    { name: "Tue", attendance: 98 },
    { name: "Wed", attendance: 95 },
    { name: "Thu", attendance: 97 },
    { name: "Fri", attendance: 94 },
  ];

  const quickActions = [
    {
      title: "Class Schedule",
      icon: Clock,
      description: "View your daily timetable",
    },
    {
      title: "Assignments",
      icon: BookOpen,
      description: "4 assignments due this week",
    },
    {
      title: "Academic Progress",
      icon: TrendingUp,
      description: "View your grades",
    },
    {
      title: "Attendance Record",
      icon: Activity,
      description: "Check-in and history",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Administrator</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening at Triumphant Baptist College
            today
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">January 2, 2025</span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <CardContent className="flex items-start p-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <action.icon className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {action.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Stats Section - Spans 4 columns */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Overview</CardTitle>
              <CardDescription>
                Average attendance rate for this week: 96%
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[90, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Total Students
                    </p>
                    <h3 className="text-2xl font-bold">1,245</h3>
                    <p className="text-sm text-blue-600">↑ 5% from last year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Graduation Rate
                    </p>
                    <h3 className="text-2xl font-bold">98.5%</h3>
                    <p className="text-sm text-green-600">
                      ↑ 2% from last year
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Content - Spans 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Parent-Teacher Conference", date: "March 15" },
                  { title: "Spring Break", date: "March 25-29" },
                  { title: "Senior Graduation Ceremony", date: "May 20" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average GPA</span>
                <span className="font-medium">3.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Teacher-Student Ratio</span>
                <span className="font-medium">1:15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">College Acceptance Rate</span>
                <span className="font-medium">95%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
