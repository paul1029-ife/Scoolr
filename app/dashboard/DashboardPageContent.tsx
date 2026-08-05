"use client";

import React, { useEffect, useState } from "react";
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
import StatCard from "@/components/common/stat-card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { formatNairaCompact } from "@/types/billing";
import type { DashboardData } from "@/lib/queries/dashboard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
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
  if (active && payload && payload.length >= 2) {
    const expected = payload[0].value;
    const collected = payload[1].value;
    const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-gray-900">{`Expected: ${naira(expected)}`}</p>
        <p className="text-blue-600">{`Collected: ${naira(collected)}`}</p>
        <p className="text-orange-500">{`Gap: ${naira(expected - collected)}`}</p>
      </div>
    );
  }
  return null;
};

/** Shown in place of a chart when there is nothing recorded yet. */
function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
      <p className="max-w-xs text-center text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function DashboardPageContent({ data }: { data: DashboardData }) {
  const [showDevAlert, setShowDevAlert] = useState(false);

  useEffect(() => {
    const hasSeenAlert = localStorage.getItem("hasSeenDevAlert");
    if (!hasSeenAlert) {
      setShowDevAlert(true);
      localStorage.setItem("hasSeenDevAlert", "true");
    }
  }, []);

  const {
    totalStudents,
    totalTeachers,
    totalClasses,
    attendanceRate,
    collectionRate,
    outstanding,
    attendanceTrend,
    feeCollection,
    recentActivities,
  } = data;

  const hasFeeData = feeCollection.some(
    (point) => point.expected > 0 || point.collected > 0
  );

  return (
    <div className="mx-auto space-y-8">
      <AlertDialog open={showDevAlert} onOpenChange={setShowDevAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🚧 Development Status</AlertDialogTitle>
            <AlertDialogDescription>
              Welcome to Scoolr! This application is currently under
              development. Figures on this page are read from your school&apos;s
              own records, so they will stay empty until you add staff,
              students, attendance and payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            amount={totalStudents.toLocaleString()}
            text={`Across ${totalClasses} ${
              totalClasses === 1 ? "class" : "classes"
            }`}
          />
          <StatCard
            title="Total Teachers"
            amount={totalTeachers.toLocaleString()}
            text="Staff on record"
          />
          <StatCard
            title="Fee collection"
            amount={
              collectionRate === null ? "—" : `${collectionRate.toFixed(0)}%`
            }
            text={
              collectionRate === null
                ? "No fee structure set"
                : `${formatNairaCompact(outstanding)} outstanding`
            }
          />
          <StatCard
            title="Attendance"
            amount={
              attendanceRate === null ? "—" : `${attendanceRate.toFixed(0)}%`
            }
            text={
              attendanceRate === null
                ? "No attendance recorded"
                : "All recorded days"
            }
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
                  Monthly student attendance percentage
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {attendanceTrend.length === 0 ? (
                <ChartEmptyState message="No attendance recorded yet. Take attendance for a class to start building this trend." />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={attendanceTrend}
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
                        domain={[0, 100]}
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
              )}
              {attendanceRate !== null && (
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Overall average:{" "}
                    <span className="font-semibold text-gray-900">
                      {attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <Link
                    href="/dashboard/students"
                    className="text-sm text-blue-600 font-medium"
                  >
                    View details
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Fee Collection
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Expected vs collected per term (₦)
                </p>
              </div>
              {collectionRate !== null && (
                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {collectionRate.toFixed(0)}% collection rate
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {!hasFeeData ? (
                <ChartEmptyState message="No fees set or payments recorded yet. Set a termly fee per class and record a payment to see collection here." />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={feeCollection}
                      margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                      barGap={6}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="term"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        width={60}
                        tickFormatter={(value) =>
                          value >= 1_000_000
                            ? `₦${(value / 1_000_000).toFixed(1)}M`
                            : `₦${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip content={<FeeTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="expected"
                        name="Expected"
                        fill="#cbd5e1"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="collected"
                        name="Collected"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-md text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
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
                {/* Was /dashboard/billing, which 404s — the route is billings. */}
                <Link href="/dashboard/billings">
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
              {recentActivities.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  Nothing has happened yet. Events and payments will appear
                  here.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={`${activity.type}-${activity.id}`}
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
                            <CalendarDays className="h-4 w-4 text-purple-700" />
                          ) : (
                            <Receipt className="h-4 w-4 text-green-700" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                timeZone: "UTC",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          activity.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPageContent;
