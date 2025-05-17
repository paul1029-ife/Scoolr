/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChevronRight,
  CalendarDays,
  BookOpen,
  Receipt,
  Bell,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/common/StatCard";

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

interface CustomTooltipProps {
  active?: boolean;
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
        <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
          <StatCard
            trending={true}
            amount="1,340"
            extra="Marginal growth in school size"
          />
          <StatCard trending={false} amount="27" text="Total Teachers" />
          <StatCard
            trending={false}
            amount="92%"
            text="Fee collection"
            extra="15M outstanding"
          />
          <StatCard
            trending={true}
            amount="95%"
            text="Attendence"
            extra="+2% this week"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Attendance Trends
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Daily student attendance percentage
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                +3% from last month
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={attendanceData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
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
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      domain={[85, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      width={30}
                      tickFormatter={(amount) => `${amount}%`}
                    />
                    <Tooltip content={<AttendanceTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#attendanceGradient)"
                      activeDot={{ r: 8, strokeWidth: 0, fill: "#2563eb" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Current average:{" "}
                  <span className="font-semibold text-gray-900">95%</span>
                </div>
                <div className="text-sm text-blue-600 font-medium cursor-pointer">
                  View details
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Fee Collection
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Expected vs collected (in millions ₦)
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                96% collection rate
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={feeCollectionData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      width={35}
                      tickFormatter={(amount) => `${amount}M`}
                    />
                    <Tooltip content={<FeeTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: "10px" }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar
                      dataKey="expected"
                      fill="#e2e8f0"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      name="Expected"
                    />
                    <Bar
                      dataKey="collected"
                      fill="#60a5fa"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                      name="Collected"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Total collected:{" "}
                  <span className="font-semibold text-gray-900">₦34.7M</span>
                </div>
                <div className="text-sm text-blue-600 font-medium cursor-pointer">
                  Generate report
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Links
              </h2>
              <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Essential tools
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/students">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Manage Students</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>
                <Link href="/dashboard/subjects">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">Manage Subjects</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>
                <Link href="/dashboard/billing">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Receipt className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Fee Management</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
