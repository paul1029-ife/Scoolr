"use client";

import Link from "next/link";
import { Check, Circle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { runAction } from "@/lib/actions/run-action";
import type { StepStatus } from "@/lib/onboarding/steps";

function Wordmark() {
  return (
    <span className="text-xl font-bold tracking-tight">
      <span className="text-blue-600">S</span>
      <span className="text-gray-900">cool</span>
      <span className="text-indigo-400">r</span>
    </span>
  );
}

export function OnboardingShell({
  schoolName,
  steps,
  currentSlug,
  allRequiredComplete,
  children,
}: {
  schoolName: string;
  steps: StepStatus[];
  currentSlug: string;
  allRequiredComplete: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isFinishing, setIsFinishing] = useState(false);

  const doneCount = steps.filter((step) => step.complete).length;

  const finish = async () => {
    setIsFinishing(true);
    const result = await runAction(() => completeOnboarding());
    setIsFinishing(false);

    if (!result.ok) {
      toast({
        title: "Not quite ready",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Wordmark />
          <p className="text-sm text-gray-600">
            Setting up <span className="font-medium">{schoolName}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Setup steps">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {doneCount} of {steps.length} done
          </p>
          <ol className="space-y-1">
            {steps.map((step) => {
              const isCurrent = step.slug === currentSlug;

              return (
                <li key={step.slug}>
                  <Link
                    href={`/onboarding/${step.slug}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`flex items-start gap-3 rounded-md px-3 py-2 transition-colors ${
                      isCurrent
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mt-0.5">
                      {step.complete ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle
                          className={`h-4 w-4 ${
                            isCurrent ? "text-blue-600" : "text-gray-300"
                          }`}
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {step.title}
                        {!step.required && (
                          <span className="ml-1 text-xs font-normal text-gray-500">
                            (optional)
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t pt-6">
            <Button
              onClick={finish}
              disabled={!allRequiredComplete || isFinishing}
              className="w-full"
            >
              {isFinishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finishing…
                </>
              ) : (
                "Go to dashboard"
              )}
            </Button>
            {!allRequiredComplete && (
              <p className="mt-2 text-xs text-gray-500">
                Finish the required steps to open the dashboard.
              </p>
            )}
          </div>
        </nav>

        <main className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}

export default OnboardingShell;
