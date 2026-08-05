import { Lock } from "lucide-react";

/** Staff accounts are admin-only; other roles reaching this route see this. */
export function NoStaffAccess() {
  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-md font-medium tracking-tight">Staff Accounts</h1>
      </div>
      <div className="px-3">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Lock className="h-5 w-5 text-gray-500" />
          </div>
          <h2 className="text-base font-medium text-gray-900">
            Staff accounts are restricted
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-600">
            Only administrators can view accounts and change what colleagues are
            allowed to do.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoStaffAccess;
