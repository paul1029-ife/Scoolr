"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
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

// Type definitions
type AttendanceData = {
  month: string;
  attendance: number;
};

type FeeCollectionData = {
  month: string;
  expected: number;
  collected: number;
};

type ActivityType = "event" | "payment";
type ActivityStatus = "upcoming" | "completed";

type RecentActivity = {
  id: number;
  title: string;
  type: ActivityType;
  date: string;
  status: ActivityStatus;
};

// Sample data for charts
const attendanceData: AttendanceData[] = [
  { month: "Sep", attendance: 95 },
  { month: "Oct", attendance: 93 },
  { month: "Nov", attendance: 96 },
  { month: "Dec", attendance: 94 },
  { month: "Jan", attendance: 95 },
];

const feeCollectionData: FeeCollectionData[] = [
  { month: "Sep", expected: 150, collected: 142 },
  { month: "Oct", expected: 150, collected: 145 },
  { month: "Nov", expected: 150, collected: 148 },
  { month: "Dec", expected: 150, collected: 144 },
  { month: "Jan", expected: 150, collected: 147 },
];

const recentActivities: RecentActivity[] = [
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

// Custom tooltip components with proper typing
interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

const AttendanceTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-blue-600">{`Attendance: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const FeeTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-gray-600">{`Expected: ₦${payload[0].value}M`}</p>
        <p className="text-blue-600">{`Collected: ₦${payload[1].value}M`}</p>
        <p className="text-orange-500">{`Gap: ₦${(
          payload[0].value - payload[1].value
        ).toFixed(1)}M`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage(): React.ReactNode {
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
                  <AreaChart
                    data={attendanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="attendanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[85, 100]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<AttendanceTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#attendanceGradient)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
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
                  <BarChart
                    data={feeCollectionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<FeeTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: "10px" }}
                    />
                    <Bar
                      dataKey="expected"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      name="Expected"
                    />
                    <Bar
                      dataKey="collected"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      name="Collected"
                    />
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
