import { getStaffMembers } from "@/lib/queries/staff";
import { currentUserCan } from "@/lib/tenant";

import { NoStaffAccess } from "./NoStaffAccess";
import { StaffPageContent } from "./StaffPageContent";

export default async function StaffPage() {
  // Who may do what is itself sensitive, so the page is gated as well as the
  // action behind it.
  if (!(await currentUserCan("school:manage"))) {
    return <NoStaffAccess />;
  }

  const staff = await getStaffMembers();

  return <StaffPageContent staff={staff} />;
}
