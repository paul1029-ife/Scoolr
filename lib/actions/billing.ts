"use server";

import { revalidatePath } from "next/cache";

import { InvoiceStatus, PaymentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission, getCurrentSchoolId } from "@/lib/tenant";
import {
  decimalToKobo,
  koboToDecimalString,
  paymentFormSchema,
  type PaymentFormData,
} from "@/types/billing";

const BILLING_PATH = "/dashboard/billings";

export type ActionResult = { ok: true } | { ok: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/** Human-readable receipt id, e.g. "PAY-LX9F2K-4B7". */
function generateReference(prefix: "PAY" | "INV"): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

/**
 * Records a payment against the student's invoice for the term, creating that
 * invoice if it does not exist yet, then recomputes the invoice status from the
 * payments actually settled against it.
 */
export async function recordPayment(
  data: PaymentFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("billing:manage");
  if (!permitted.ok) return permitted;

  const parsed = paymentFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid payment details",
    };
  }

  const { studentId, amountNaira, category, status, method, termId } =
    parsed.data;
  const schoolId = await getCurrentSchoolId();

  const student = await prisma.student.findFirst({
    where: { id: studentId, schoolId },
    select: { id: true, classRoomId: true },
  });

  if (!student) {
    return { ok: false, error: "That student does not exist." };
  }

  const term = termId
    ? await prisma.term.findFirst({
        where: { id: termId, session: { schoolId } },
        select: { id: true },
      })
    : await prisma.term.findFirst({
        where: { isCurrent: true, session: { schoolId } },
        select: { id: true },
      });

  if (!term) {
    return {
      ok: false,
      error: "No academic term is set up yet. Run the seed to create one.",
    };
  }

  // Round once, here — every later figure derives from this integer.
  const amountKobo = Math.round(amountNaira * 100);

  try {
    await prisma.$transaction(async (tx) => {
      let invoice = await tx.invoice.findFirst({
        where: { schoolId, studentId, termId: term.id, category },
        select: { id: true, amount: true },
      });

      if (!invoice) {
        // Bill the class's termly fee where one is set; otherwise this payment
        // defines the amount owed.
        const feeStructure = student.classRoomId
          ? await tx.feeStructure.findFirst({
              where: {
                classRoomId: student.classRoomId,
                termId: term.id,
                category,
              },
              select: { amount: true },
            })
          : null;

        invoice = await tx.invoice.create({
          data: {
            schoolId,
            studentId,
            termId: term.id,
            category,
            reference: generateReference("INV"),
            amount: feeStructure
              ? feeStructure.amount
              : koboToDecimalString(amountKobo),
            dueDate: new Date(),
          },
          select: { id: true, amount: true },
        });
      }

      await tx.payment.create({
        data: {
          schoolId,
          studentId,
          invoiceId: invoice.id,
          reference: generateReference("PAY"),
          amount: koboToDecimalString(amountKobo),
          method,
          status,
          paidAt: new Date(),
        },
      });

      // Settled total, recomputed from rows rather than incremented, so it can
      // never drift from what was actually recorded.
      const settled = await tx.payment.aggregate({
        where: { invoiceId: invoice.id, status: PaymentStatus.PAID },
        _sum: { amount: true },
      });

      const paidKobo = settled._sum.amount
        ? decimalToKobo(settled._sum.amount)
        : 0;
      const invoiceKobo = decimalToKobo(invoice.amount);

      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          status:
            paidKobo >= invoiceKobo && invoiceKobo > 0
              ? InvoiceStatus.PAID
              : paidKobo > 0
              ? InvoiceStatus.PARTIAL
              : InvoiceStatus.PENDING,
        },
      });
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        error: "That receipt reference already exists. Please try again.",
      };
    }
    throw error;
  }

  revalidatePath(BILLING_PATH);
  return { ok: true };
}

/** Sets the termly fee for a class, which drives the expected-collection figure. */
export async function setClassFee(
  classRoomId: string,
  termId: string,
  amountNaira: number
): Promise<ActionResult> {
  const permitted = await ensurePermission("billing:manage");
  if (!permitted.ok) return permitted;

  if (!Number.isFinite(amountNaira) || amountNaira < 0) {
    return { ok: false, error: "Enter a valid amount." };
  }

  const schoolId = await getCurrentSchoolId();

  const classRoom = await prisma.classRoom.findFirst({
    where: { id: classRoomId, schoolId },
    select: { id: true },
  });

  if (!classRoom) {
    return { ok: false, error: "That class does not exist." };
  }

  const term = await prisma.term.findFirst({
    where: { id: termId, session: { schoolId } },
    select: { id: true },
  });

  if (!term) {
    return { ok: false, error: "That term does not exist." };
  }

  const amount = koboToDecimalString(Math.round(amountNaira * 100));

  await prisma.feeStructure.upsert({
    where: {
      classRoomId_termId_category: {
        classRoomId,
        termId,
        category: "SCHOOL_FEES",
      },
    },
    update: { amount },
    create: {
      schoolId,
      classRoomId,
      termId,
      category: "SCHOOL_FEES",
      amount,
    },
  });

  revalidatePath(BILLING_PATH);
  return { ok: true };
}
