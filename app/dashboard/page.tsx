"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  GraduationCap,
  Clock,
  TrendingUp,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Receipt,
  Bell,
} from "lucide-react";
import Link from "next/link";

// Sample data for charts
const attendanceData = [
  { month: "Sep", attendance: 95 },
  { month: "Oct", attendance: 93 },
  { month: "Nov", attendance: 96 },
  { month: "Dec", attendance: 94 },
  { month: "Jan", attendance: 95 },
];

const feeCollectionData = [
  { month: "Sep", expected: 150, collected: 142 },
  { month: "Oct", expected: 150, collected: 145 },
  { month: "Nov", expected: 150, collected: 148 },
  { month: "Dec", expected: 150, collected: 144 },
  { month: "Jan", expected: 150, collected: 147 },
];

const recentActivities = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    type: "event",
    date: "2024-01-20",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Term Fees Payment",
    type: "payment",
    date: "2024-01-18",
    status: "completed",
  },
  {
    id: 3,
    title: "Inter-House Sports",
    type: "event",
    date: "2024-01-25",
    status: "upcoming",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto space-y-8">
      {/* Header Section */}
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky  top-0 py-2 items-center justify-between z-10">
        <div>
          <h1 className="text-md text-gray-800 font-medium tracking-tight">
            Overview
          </h1>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
      </div>

      <div className="px-3 flex flex-col gap-3">
        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl ">1,234</p>
                <p className="text-sm text-green-600">+5% from last term</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-indigo-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Total Teachers
                </p>
                <p className="text-2xl ">98</p>
                <p className="text-sm text-green-600">+2 new this term</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Attendance
                </p>
                <p className="text-2xl ">95%</p>
                <p className="text-sm">+2% this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Fee Collection
                </p>
                <p className="text-2xl ">92%</p>
                <p className="text-sm text-yellow-600">₦15M outstanding</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-md text-gray-900">Attendance Trends</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <h2 className="text-md text-gray-900">
                Fee Collection (in millions ₦)
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeCollectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="expected" fill="#94a3b8" />
                    <Bar dataKey="collected" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-md text-gray-900">Quick Links</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/students">
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Students
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/subjects">
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Manage Subjects
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard/billing">
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Fee Management
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <h2 className="text-md text-gray-900">Recent Activities</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 ${
                          activity.type === "event"
                            ? "bg-purple-100"
                            : "bg-green-100"
                        } rounded-full`}
                      >
                        {activity.type === "event" ? (
                          <CalendarDays
                            className={`h-4 w-4 ${
                              activity.type === "event"
                                ? "text-purple-700"
                                : "text-green-700"
                            }`}
                          />
                        ) : (
                          <Receipt className="h-4 w-4 text-green-700" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-lg">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        activity.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
