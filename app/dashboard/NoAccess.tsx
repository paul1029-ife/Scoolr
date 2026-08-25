import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FullPageNotice } from "@/components/common/page-header";
import { roleLabel, type Role } from "@/lib/auth/permissions";

/** Shown when a signed-in user's role has no staff dashboard access. */
export function NoAccess({ role }: { role: Role }) {
  return (
    <FullPageNotice
      icon={ShieldAlert}
      tone="warning"
      title="No dashboard access"
      description={`Your account is set up as a ${roleLabel[
        role
      ].toLowerCase()}, which does not have access to the staff dashboard. Ask an administrator at your school if you think this is wrong.`}
      action={
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      }
    />
  );
}

export default NoAccess;
