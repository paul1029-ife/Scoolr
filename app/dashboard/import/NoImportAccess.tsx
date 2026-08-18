import { Lock } from "lucide-react";

export function NoImportAccess() {
  return (
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-border bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">Import Data</h1>
      </div>
      <div className="px-3">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium text-gray-900">
            Importing is restricted
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Only administrators can bulk-load student, staff and class records.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoImportAccess;
