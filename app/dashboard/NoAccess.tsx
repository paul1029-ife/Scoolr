import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { roleLabel, type Role } from "@/lib/auth/permissions";

/** Shown when a signed-in user's role has no staff dashboard access. */
export function NoAccess({ role }: { role: Role }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <ShieldAlert className="h-6 w-6 text-amber-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          No dashboard access
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Your account is set up as a {roleLabel[role].toLowerCase()}, which
          does not have access to the staff dashboard. Ask an administrator at
          your school if you think this is wrong.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NoAccess;
