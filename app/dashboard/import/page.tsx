import { getRecentImports } from "@/lib/actions/import";
import { currentUserCan } from "@/lib/tenant";

import { ImportPageContent } from "./ImportPageContent";
import { NoImportAccess } from "./NoImportAccess";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  // Bulk-loading records is an administrative act. Individual entity imports
  // are permission-checked again inside the actions.
  if (!(await currentUserCan("school:manage"))) {
    return <NoImportAccess />;
  }

  const recentImports = await getRecentImports();

  return <ImportPageContent recentImports={recentImports} />;
}
