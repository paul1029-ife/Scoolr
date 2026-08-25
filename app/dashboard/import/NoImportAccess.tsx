import { RestrictedPage } from "@/components/common/page-header";

/** Importing is admin-only; other roles reaching this route see this. */
export function NoImportAccess() {
  return (
    <RestrictedPage
      title="Import"
      heading="Importing is restricted"
      description="Only administrators can bulk-load student, staff and class records."
    />
  );
}

export default NoImportAccess;
