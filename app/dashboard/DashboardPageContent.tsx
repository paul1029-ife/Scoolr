"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Receipt,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Metric, MetricGroup } from "@/components/common/metric";
import {
  EmptyState,
  PageBody,
  PageHeader,
} from "@/components/common/page-header";

import { formatNairaCompact } from "@/types/billing";
import type { DashboardData } from "@/lib/queries/dashboard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

/**
 * Chart tooltips share the app's popover language — same border, radius and
 * type scale as a dropdown — so they read as part of the interface rather than
 * as something the charting library brought with it.
 */
function ChartTooltipShell({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[9rem] rounded-md border border-border bg-popover p-2.5 shadow-sm">
      <p className="mb-1.5 text-xs font-medium text-foreground">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function TooltipRow({
  swatch,
  name,
  value,
}: {
  swatch?: string;
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {swatch && (
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: swatch }}
            aria-hidden
          />
        )}
        {name}
      </span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

const AttendanceTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltipShell label={label}>
        <TooltipRow
          swatch="hsl(var(--chart-1))"
          name="Attendance"
          value={`${payload[0].value}%`}
        />
      </ChartTooltipShell>
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
      <ChartTooltipShell label={label}>
        <TooltipRow
          swatch="hsl(var(--chart-3))"
          name="Expected"
          value={naira(expected)}
        />
        <TooltipRow
          swatch="hsl(var(--chart-1))"
          name="Collected"
          value={naira(collected)}
        />
        <div className="mt-0.5 border-t border-border pt-1">
          <TooltipRow name="Gap" value={naira(expected - collected)} />
        </div>
      </ChartTooltipShell>
    );
  }
  return null;
};

/** Shared axis styling so both charts sit on the same grid. */
const axisTick = { fill: "hsl(var(--muted-foreground))", fontSize: 11 };
const gridStroke = "hsl(var(--border))";

/** Shown in place of a chart when there is nothing recorded yet. */
function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center">
      <p className="max-w-xs text-center text-[13px] text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

const quickActions = [
  { href: "/dashboard/students", label: "Manage students", icon: Users },
  { href: "/dashboard/subjects", label: "Manage subjects", icon: BookOpen },
  // Was /dashboard/billing, which 404s — the route is billings.
  { href: "/dashboard/billings", label: "Fee management", icon: Receipt },
];

export function DashboardPageContent({ data }: { data: DashboardData }) {
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
    <>
      <PageHeader
        title="Overview"
        description="Attendance, fees and activity across your school"
      />

      <PageBody className="space-y-5">
        <MetricGroup>
          <Metric
            label="Students"
            value={totalStudents.toLocaleString()}
            hint={`Across ${totalClasses} ${
              totalClasses === 1 ? "class" : "classes"
            }`}
          />
          <Metric
            label="Teachers"
            value={totalTeachers.toLocaleString()}
            hint="Staff on record"
          />
          <Metric
            label="Fee collection"
            value={
              collectionRate === null ? "—" : `${collectionRate.toFixed(0)}%`
            }
            hint={
              collectionRate === null
                ? "No fee structure set"
                : `${formatNairaCompact(outstanding)} outstanding`
            }
          />
          <Metric
            label="Attendance"
            value={
              attendanceRate === null ? "—" : `${attendanceRate.toFixed(0)}%`
            }
            hint={
              attendanceRate === null
                ? "No attendance recorded"
                : "All recorded days"
            }
          />
        </MetricGroup>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>Attendance trend</CardTitle>
                <p className="text-[13px] text-muted-foreground">
                  Monthly student attendance
                </p>
              </div>
              {attendanceRate !== null && (
                <span className="text-right text-[13px] tabular-nums text-muted-foreground">
                  <span className="block text-base font-semibold text-foreground">
                    {attendanceRate.toFixed(1)}%
                  </span>
                  average
                </span>
              )}
            </CardHeader>
            <CardContent>
              {attendanceTrend.length === 0 ? (
                <ChartEmptyState message="No attendance recorded yet. Take attendance for a class to start building this trend." />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={attendanceTrend}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
                            offset="0%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.18}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        stroke={gridStroke}
                        strokeDasharray="0"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={axisTick}
                        dy={8}
                      />
                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={axisTick}
                        width={44}
                        tickFormatter={(amount) => `${amount}%`}
                      />
                      <Tooltip
                        content={<AttendanceTooltip />}
                        cursor={{
                          stroke: gridStroke,
                          strokeWidth: 1,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        fill="url(#attendanceGradient)"
                        activeDot={{
                          r: 4,
                          strokeWidth: 2,
                          stroke: "hsl(var(--background))",
                          fill: "hsl(var(--chart-1))",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle>Fee collection</CardTitle>
                <p className="text-[13px] text-muted-foreground">
                  Expected against collected, per term
                </p>
              </div>
              {/* A legend row, but as text — recharts' <Legend> adds its own
                  spacing and typography that never matches the card. */}
              {hasFeeData && (
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-chart-3" />
                    Expected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-chart-1" />
                    Collected
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!hasFeeData ? (
                <ChartEmptyState message="No fees set or payments recorded yet. Set a termly fee per class and record a payment to see collection here." />
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={feeCollection}
                      margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                      barGap={4}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke={gridStroke}
                        strokeDasharray="0"
                      />
                      <XAxis
                        dataKey="term"
                        axisLine={false}
                        tickLine={false}
                        tick={axisTick}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={axisTick}
                        width={64}
                        tickFormatter={(value) =>
                          value >= 1_000_000
                            ? `₦${(value / 1_000_000).toFixed(1)}M`
                            : `₦${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        content={<FeeTooltip />}
                        cursor={{ fill: "hsl(var(--muted))" }}
                      />
                      <Bar
                        dataKey="expected"
                        name="Expected"
                        fill="hsl(var(--chart-3))"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="collected"
                        name="Collected"
                        fill="hsl(var(--chart-1))"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="border-b border-border">
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            {recentActivities.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="Nothing has happened yet"
                description="Events and payments will appear here as they are recorded."
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentActivities.map((activity) => (
                  <li
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        {activity.type === "event" ? (
                          <CalendarDays className="size-3.5" />
                        ) : (
                          <Receipt className="size-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            timeZone: "UTC",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      dot
                      variant={
                        activity.status === "completed" ? "success" : "outline"
                      }
                      className="shrink-0 capitalize"
                    >
                      {activity.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <div className="divide-y divide-border">
              {quickActions.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-[13px] font-medium text-foreground">
                      {label}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

export default DashboardPageContent;
