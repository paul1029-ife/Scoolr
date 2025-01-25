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
import { useAuth } from "@clerk/nextjs";

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

function truncate(word: string | null | undefined) {
  if (word === null) return;
  if (word === undefined) return;
  if (word.length >= 8) {
    return word.slice(0, 10) + "...";
  }
}
export default function DashboardPage() {
  const { userId } = useAuth();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Triumphant Baptist College Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin {truncate(userId)}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-green-600">+5% from last term</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-2xl font-bold">98</p>
              <p className="text-sm text-green-600">+2 new this term</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Average Attendance
              </p>
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm text-green-600">+2% this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fee Collection</p>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-yellow-600">₦15M outstanding</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b">
            <h2 className="text-xl font-semibold">Attendance Trends</h2>
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
            <h2 className="text-xl font-semibold">
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
            <h2 className="text-xl font-semibold">Quick Links</h2>
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
            <h2 className="text-xl font-semibold">Recent Activities</h2>
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
                      <p className="text-sm text-muted-foreground">
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
  );
}
