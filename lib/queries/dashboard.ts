import "server-only";

import { AttendanceStatus, PaymentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import { decimalToKobo, type Kobo } from "@/types/billing";

export type AttendancePoint = { month: string; attendance: number };
export type FeeCollectionPoint = {
  term: string;
  expected: number;
  collected: number;
};
export type RecentActivity = {
  id: string;
  title: string;
  type: "event" | "payment";
  date: string;
  status: string;
};

export type DashboardData = {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  /** Null until there is anything to measure. */
  attendanceRate: number | null;
  collectionRate: number | null;
  outstanding: Kobo;
  attendanceTrend: AttendancePoint[];
  feeCollection: FeeCollectionPoint[];
  recentActivities: RecentActivity[];
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function termLabel(name: string) {
  return { FIRST: "1st Term", SECOND: "2nd Term", THIRD: "3rd Term" }[name] ?? name;
}

/**
 * Monthly attendance percentage, aggregated in Postgres rather than by pulling
 * every attendance row into the app — a full school year is easily six figures
 * of rows.
 */
async function getAttendanceTrend(schoolId: string): Promise<AttendancePoint[]> {
  const rows = await prisma.$queryRaw<
    { month: Date; present: bigint; total: bigint }[]
  >`
    SELECT date_trunc('month', a."date") AS month,
           COUNT(*) FILTER (WHERE a."status" IN ('PRESENT', 'LATE')) AS present,
           COUNT(*) AS total
    FROM "attendance_records" a
    JOIN "class_rooms" c ON c."id" = a."classRoomId"
    WHERE c."schoolId" = ${schoolId}
    GROUP BY 1
    ORDER BY 1 DESC
    LIMIT 6
  `;

  return rows
    .map((row) => ({
      month: MONTH_LABELS[new Date(row.month).getUTCMonth()],
      attendance:
        Number(row.total) > 0
          ? Math.round((Number(row.present) / Number(row.total)) * 1000) / 10
          : 0,
    }))
    .reverse();
}

/** Expected vs collected per term, in naira. */
async function getFeeCollection(
  schoolId: string
): Promise<{ points: FeeCollectionPoint[]; totalExpected: Kobo; totalCollected: Kobo }> {
  const [terms, feeStructures, classRooms, collectedRows] = await Promise.all([
    prisma.term.findMany({
      where: { session: { schoolId } },
      select: { id: true, name: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.feeStructure.findMany({
      where: { schoolId },
      select: { termId: true, classRoomId: true, amount: true },
    }),
    prisma.classRoom.findMany({
      where: { schoolId },
      select: { id: true, _count: { select: { students: true } } },
    }),
    prisma.$queryRaw<{ termId: string; collected: string }[]>`
      SELECT i."termId" AS "termId", SUM(p."amount")::text AS collected
      FROM "payments" p
      JOIN "invoices" i ON i."id" = p."invoiceId"
      WHERE p."schoolId" = ${schoolId} AND p."status" = 'PAID'
      GROUP BY 1
    `,
  ]);

  const studentsByClass = new Map(
    classRooms.map((c) => [c.id, c._count.students])
  );
  const collectedByTerm = new Map(
    collectedRows.map((row) => [row.termId, decimalToKobo(row.collected)])
  );

  let totalExpected = 0;
  let totalCollected = 0;

  const points = terms.map((term) => {
    const expected = feeStructures
      .filter((fee) => fee.termId === term.id)
      .reduce(
        (sum, fee) =>
          sum + decimalToKobo(fee.amount) * (studentsByClass.get(fee.classRoomId) ?? 0),
        0
      );
    const collected = collectedByTerm.get(term.id) ?? 0;

    totalExpected += expected;
    totalCollected += collected;

    return {
      term: termLabel(term.name),
      // Charts read in naira; kobo would be unreadable on an axis.
      expected: Math.round(expected / 100),
      collected: Math.round(collected / 100),
    };
  });

  return { points, totalExpected, totalCollected };
}

export async function getDashboardData(): Promise<DashboardData> {
  const schoolId = await getCurrentSchoolId();

  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    attendanceCounts,
    attendanceTrend,
    fees,
    events,
    payments,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.teacher.count({ where: { schoolId } }),
    prisma.classRoom.count({ where: { schoolId } }),
    prisma.attendance.groupBy({
      by: ["status"],
      where: { classRoom: { schoolId } },
      _count: { _all: true },
    }),
    getAttendanceTrend(schoolId),
    getFeeCollection(schoolId),
    prisma.event.findMany({
      where: { schoolId },
      select: { id: true, title: true, startsAt: true, status: true },
      orderBy: { startsAt: "desc" },
      take: 5,
    }),
    prisma.payment.findMany({
      where: { schoolId },
      select: {
        id: true,
        paidAt: true,
        status: true,
        student: { select: { name: true } },
      },
      orderBy: { paidAt: "desc" },
      take: 5,
    }),
  ]);

  const attended = attendanceCounts
    .filter(
      (row) =>
        row.status === AttendanceStatus.PRESENT ||
        row.status === AttendanceStatus.LATE
    )
    .reduce((sum, row) => sum + row._count._all, 0);
  const attendanceTotal = attendanceCounts.reduce(
    (sum, row) => sum + row._count._all,
    0
  );

  const recentActivities: RecentActivity[] = [
    ...events.map((event) => ({
      id: event.id,
      title: event.title,
      type: "event" as const,
      date: event.startsAt.toISOString(),
      status: event.status.toLowerCase(),
    })),
    ...payments.map((payment) => ({
      id: payment.id,
      title: `Payment — ${payment.student.name}`,
      type: "payment" as const,
      date: payment.paidAt.toISOString(),
      status:
        payment.status === PaymentStatus.PAID ? "completed" : payment.status.toLowerCase(),
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    attendanceRate:
      attendanceTotal > 0 ? (attended / attendanceTotal) * 100 : null,
    collectionRate:
      fees.totalExpected > 0
        ? (fees.totalCollected / fees.totalExpected) * 100
        : null,
    outstanding: Math.max(fees.totalExpected - fees.totalCollected, 0),
    attendanceTrend,
    feeCollection: fees.points,
    recentActivities,
  };
}
