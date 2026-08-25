import { RestrictedPage } from "@/components/common/page-header";

/** Staff accounts are admin-only; other roles reaching this route see this. */
export function NoStaffAccess() {
  return (
    <RestrictedPage
      title="Staff accounts"
      heading="Staff accounts are restricted"
      description="Only administrators can view accounts and change what colleagues are allowed to do."
    />
  );
}

export default NoStaffAccess;
