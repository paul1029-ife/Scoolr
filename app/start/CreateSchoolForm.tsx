"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchool } from "@/lib/actions/school";
import { runAction } from "@/lib/actions/run-action";

export function CreateSchoolForm({ email }: { email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const result = await runAction(() => createSchool({ name }));
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    // Straight into setup — the school exists but has no calendar or classes.
    router.push("/onboarding");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="schoolName">School name</Label>
        <Input
          id="schoolName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Triumphant Baptist College"
          autoFocus
          required
          disabled={isSaving}
        />
        <p className="text-xs text-gray-500">
          You can change this, and add the rest of the details, in the next step.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSaving || name.trim().length < 3}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          "Create school and continue"
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Signed in as {email}
      </p>
    </form>
  );
}

export default CreateSchoolForm;
