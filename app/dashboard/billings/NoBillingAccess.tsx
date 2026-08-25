import { RestrictedPage } from "@/components/common/page-header";

/** Billing is admin-only; teachers reaching this route see this instead. */
export function NoBillingAccess() {
  return (
    <RestrictedPage
      title="Billing"
      heading="Billing is restricted"
      description="Only administrators can view fee structures and payment records."
    />
  );
}

export default NoBillingAccess;
