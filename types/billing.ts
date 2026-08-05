import { z } from "zod";

import { FeeCategory, PaymentMethod, PaymentStatus } from "@/lib/generated/prisma/enums";

export { FeeCategory, PaymentMethod, PaymentStatus };

/**
 * Money is carried between server and client as a whole number of kobo.
 *
 * Two reasons: Prisma's `Decimal` is not serialisable across the React Server
 * Component boundary, and naira floats accumulate rounding error once you start
 * summing them. The database keeps `Decimal(12, 2)`; only the transport is kobo.
 */
export type Kobo = number;

export function decimalToKobo(value: { toString(): string }): Kobo {
  return Math.round(Number(value.toString()) * 100);
}

export function koboToDecimalString(kobo: Kobo): string {
  return (kobo / 100).toFixed(2);
}

/** "₦125,000" — whole naira, matching how the billing page already reads. */
export function formatNaira(kobo: Kobo): string {
  return `₦${Math.round(kobo / 100).toLocaleString("en-NG")}`;
}

/** "₦1.5M" for the summary cards. */
export function formatNairaCompact(kobo: Kobo): string {
  const naira = kobo / 100;
  if (Math.abs(naira) >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (Math.abs(naira) >= 1_000) return `₦${(naira / 1_000).toFixed(1)}K`;
  return `₦${Math.round(naira).toLocaleString("en-NG")}`;
}

/**
 * Percentage of `expected` that has been collected.
 * Returns null when nothing is expected, so callers show "—" instead of NaN%.
 */
export function collectionRate(
  collected: Kobo,
  expected: Kobo
): number | null {
  if (expected <= 0) return null;
  return (collected / expected) * 100;
}

export const paymentFormSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  /** Whole naira, as typed into the amount box. */
  amountNaira: z
    .number({ invalid_type_error: "Enter an amount" })
    .positive("Amount must be greater than zero")
    .max(100_000_000, "That amount looks too large"),
  category: z.nativeEnum(FeeCategory),
  status: z.nativeEnum(PaymentStatus),
  method: z.nativeEnum(PaymentMethod),
  termId: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

export type PaymentRow = {
  id: string;
  reference: string;
  studentName: string;
  className: string | null;
  amount: Kobo;
  paidAt: string;
  status: PaymentStatus;
};

export type ClassFeeSummary = {
  classRoomId: string;
  className: string;
  totalStudents: number;
  termlyFee: Kobo;
  expected: Kobo;
  collected: Kobo;
};

export type BillingOverview = {
  payments: PaymentRow[];
  feeStructure: ClassFeeSummary[];
  totalExpected: Kobo;
  totalCollected: Kobo;
  terms: { id: string; label: string; isCurrent: boolean }[];
  selectedTermId: string | null;
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  [PaymentStatus.PAID]: "Paid",
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.FAILED]: "Failed",
  [PaymentStatus.REFUNDED]: "Refunded",
};

export const feeCategoryLabel: Record<FeeCategory, string> = {
  [FeeCategory.SCHOOL_FEES]: "School Fees",
  [FeeCategory.BUS]: "Bus Fee",
  [FeeCategory.UNIFORM]: "Uniform",
  [FeeCategory.EXAM]: "Exam Fee",
  [FeeCategory.BOOKS]: "Books",
  [FeeCategory.OTHER]: "Other",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Cash",
  [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
  [PaymentMethod.CARD]: "Card",
  [PaymentMethod.CHEQUE]: "Cheque",
  [PaymentMethod.OTHER]: "Other",
};
