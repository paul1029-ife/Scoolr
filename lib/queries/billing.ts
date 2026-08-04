import "server-only";

import { PaymentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import {
  decimalToKobo,
  type BillingOverview,
  type ClassFeeSummary,
  type Kobo,
} from "@/types/billing";

function termLabel(name: string) {
  const ordinal = { FIRST: "1st", SECOND: "2nd", THIRD: "3rd" }[name] ?? name;
  return `${ordinal} Term`;
}

/**
 * Everything the billing page shows, for one term.
 *
 * Expected and collected are derived — expected from enrolment × the class's
 * termly fee, collected from payments actually recorded. The previous page
 * carried both as hardcoded constants that could never disagree with reality
 * because they were never checked against it.
 */
export async function getBillingOverview(
  requestedTermId?: string
): Promise<BillingOverview> {
  const schoolId = await getCurrentSchoolId();

  const termRows = await prisma.term.findMany({
    where: { session: { schoolId } },
    select: { id: true, name: true, isCurrent: true, startDate: true },
    orderBy: { startDate: "asc" },
  });

  const terms = termRows.map((term) => ({
    id: term.id,
    label: termLabel(term.name),
    isCurrent: term.isCurrent,
  }));

  const selectedTermId =
    (requestedTermId && terms.some((t) => t.id === requestedTermId)
      ? requestedTermId
      : null) ??
    termRows.find((t) => t.isCurrent)?.id ??
    termRows[0]?.id ??
    null;

  const [classRooms, feeStructures, payments] = await Promise.all([
    prisma.classRoom.findMany({
      where: { schoolId },
      select: {
        id: true,
        name: true,
        arm: true,
        _count: { select: { students: true } },
      },
      orderBy: [{ name: "asc" }, { arm: "asc" }],
    }),
    selectedTermId
      ? prisma.feeStructure.findMany({
          where: { schoolId, termId: selectedTermId },
          select: { classRoomId: true, amount: true },
        })
      : Promise.resolve([]),
    prisma.payment.findMany({
      where: {
        schoolId,
        ...(selectedTermId ? { invoice: { termId: selectedTermId } } : {}),
      },
      select: {
        id: true,
        reference: true,
        amount: true,
        paidAt: true,
        status: true,
        student: {
          select: {
            name: true,
            classRoom: { select: { id: true, name: true, arm: true } },
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: 100,
    }),
  ]);

  const feeByClassRoom = new Map<string, Kobo>(
    feeStructures.map((fee) => [fee.classRoomId, decimalToKobo(fee.amount)])
  );

  // Only settled money counts as collected; pending and failed do not.
  const collectedByClassRoom = new Map<string, Kobo>();
  for (const payment of payments) {
    if (payment.status !== PaymentStatus.PAID) continue;

    const classRoomId = payment.student.classRoom?.id;
    if (!classRoomId) continue;

    collectedByClassRoom.set(
      classRoomId,
      (collectedByClassRoom.get(classRoomId) ?? 0) + decimalToKobo(payment.amount)
    );
  }

  const feeStructure: ClassFeeSummary[] = classRooms.map((classRoom) => {
    const termlyFee = feeByClassRoom.get(classRoom.id) ?? 0;

    return {
      classRoomId: classRoom.id,
      className: [classRoom.name, classRoom.arm].filter(Boolean).join(" "),
      totalStudents: classRoom._count.students,
      termlyFee,
      expected: termlyFee * classRoom._count.students,
      collected: collectedByClassRoom.get(classRoom.id) ?? 0,
    };
  });

  return {
    payments: payments.map((payment) => ({
      id: payment.id,
      reference: payment.reference,
      studentName: payment.student.name,
      className: payment.student.classRoom
        ? [payment.student.classRoom.name, payment.student.classRoom.arm]
            .filter(Boolean)
            .join(" ")
        : null,
      amount: decimalToKobo(payment.amount),
      paidAt: payment.paidAt.toISOString(),
      status: payment.status,
    })),
    feeStructure,
    totalExpected: feeStructure.reduce((sum, fee) => sum + fee.expected, 0),
    totalCollected: feeStructure.reduce((sum, fee) => sum + fee.collected, 0),
    terms,
    selectedTermId,
  };
}

/** Students grouped for the Record Payment form. */
export async function getPaymentFormOptions() {
  const schoolId = await getCurrentSchoolId();

  const students = await prisma.student.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      registrationNumber: true,
      classRoom: { select: { id: true, name: true, arm: true } },
    },
    orderBy: { name: "asc" },
  });

  return students.map((student) => ({
    id: student.id,
    name: student.name,
    registrationNumber: student.registrationNumber,
    classRoomId: student.classRoom?.id ?? null,
    className: student.classRoom
      ? [student.classRoom.name, student.classRoom.arm].filter(Boolean).join(" ")
      : null,
  }));
}
