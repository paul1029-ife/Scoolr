import { Wrench } from "lucide-react";

/**
 * Shown to staff who cannot run the wizard while their school is still being
 * set up. Without classes and a term, every dashboard page would be empty.
 */
export function SetupPending() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Wrench className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900">
          Your school is still being set up
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An administrator needs to finish adding the academic session, terms
          and classes before the dashboard can be used. You&apos;ll have access
          as soon as that&apos;s done.
        </p>
      </div>
    </div>
  );
}

export default SetupPending;
