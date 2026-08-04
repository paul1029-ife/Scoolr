import {
  getBillingOverview,
  getPaymentFormOptions,
} from "@/lib/queries/billing";
import { currentUserCan } from "@/lib/tenant";

import { BillingsPageContent } from "./BillingsPageContent";
import { NoBillingAccess } from "./NoBillingAccess";

export default async function BillingsPage({
  searchParams,
}: {
  searchParams: Promise<{ term?: string }>;
}) {
  // Fee records are the most sensitive data here, so the page itself is gated
  // rather than only its actions — a teacher should not see collection figures.
  if (!(await currentUserCan("billing:view"))) {
    return <NoBillingAccess />;
  }

  const { term } = await searchParams;

  const [overview, students] = await Promise.all([
    getBillingOverview(term),
    getPaymentFormOptions(),
  ]);

  return <BillingsPageContent overview={overview} students={students} />;
}
