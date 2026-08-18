"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { runAction } from "@/lib/actions/run-action";
import {
  addSubjectsInBulk,
  saveAcademicCalendar,
  saveClassRooms,
  saveGradingScale,
  saveSchoolProfile,
} from "@/lib/actions/onboarding";
import {
  DEFAULT_CLASSES,
  NIGERIAN_STATES,
  SUGGESTED_SUBJECTS,
  SchoolLevel,
  SchoolType,
  Stream,
  TermName,
  WAEC_GRADE_BANDS,
  currentSessionStartYear,
  defaultSessionDates,
  schoolTypeLabel,
  streamLabel,
  termLabel,
} from "@/lib/onboarding/nigeria";
import type {
  OnboardingClassRoom,
  OnboardingGrading,
  OnboardingSchool,
  OnboardingSession,
} from "@/lib/queries/onboarding";

/** Shared save/continue behaviour for every step. */
function useStepSave(nextSlug: string | null) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const save = async (
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
    successMessage: string
  ) => {
    setIsSaving(true);
    const result = await runAction(action);
    setIsSaving(false);

    if (!result.ok) {
      toast({
        title: "Could not save",
        description: result.error,
        variant: "destructive",
      });
      return false;
    }

    toast({ title: successMessage });
    if (nextSlug) router.push(`/onboarding/${nextSlug}`);
    router.refresh();
    return true;
  };

  return { save, isSaving };
}

function StepHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-600">{children}</p>
    </div>
  );
}

function StepActions({
  isSaving,
  label = "Save and continue",
}: {
  isSaving: boolean;
  label?: string;
}) {
  return (
    <div className="mt-8 flex justify-end border-t pt-6">
      <Button
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? "Saving…" : label}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export function ProfileStep({ school }: { school: OnboardingSchool }) {
  const { save, isSaving } = useStepSave("calendar");
  const [form, setForm] = useState({
    name: school.name,
    type: school.type,
    motto: school.motto ?? "",
    address: school.address ?? "",
    state: school.state ?? "",
    lga: school.lga ?? "",
    phone: school.phone ?? "",
    email: school.email ?? "",
    website: school.website ?? "",
    principalName: school.principalName ?? "",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(
          () => saveSchoolProfile({ ...form, type: form.type as SchoolType }),
          "School profile saved"
        );
      }}
    >
      <StepHeader title="School profile">
        This appears on report cards, receipts and anything else the school
        issues.
      </StepHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">School name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">School type *</Label>
          <Select
            value={form.type}
            onValueChange={(value) => set("type", value)}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SchoolType).map((value) => (
                <SelectItem key={value} value={value}>
                  {schoolTypeLabel[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="principalName">Principal</Label>
          <Input
            id="principalName"
            value={form.principalName}
            onChange={(e) => set("principalName", e.target.value)}
            placeholder="Mrs. Adaeze Okonkwo"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="motto">Motto</Label>
          <Input
            id="motto"
            value={form.motto}
            onChange={(e) => set("motto", e.target.value)}
            placeholder="Knowledge and Character"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="12 Awolowo Road, Ikoyi"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select
            value={form.state}
            onValueChange={(value) => set("state", value)}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lga">Local Government Area</Label>
          <Input
            id="lga"
            value={form.lga}
            onChange={(e) => set("lga", e.target.value)}
            placeholder="Eti-Osa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="info@school.edu.ng"
          />
        </div>
      </div>

      <StepActions isSaving={isSaving} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export function CalendarStep({ session }: { session: OnboardingSession }) {
  const { save, isSaving } = useStepSave("classes");
  const defaults = defaultSessionDates(currentSessionStartYear());

  const [form, setForm] = useState(() => {
    if (!session) return defaults;

    const byName = new Map(session.terms.map((t) => [t.name, t]));
    return {
      name: session.name,
      startDate: session.startDate.slice(0, 10),
      endDate: session.endDate.slice(0, 10),
      terms: defaults.terms.map((fallback) => {
        const existing = byName.get(fallback.name);
        return existing
          ? {
              name: fallback.name,
              startDate: existing.startDate.slice(0, 10),
              endDate: existing.endDate.slice(0, 10),
            }
          : fallback;
      }),
    };
  });

  const setTerm = (index: number, key: "startDate" | "endDate", value: string) =>
    setForm((prev) => ({
      ...prev,
      terms: prev.terms.map((term, i) =>
        i === index ? { ...term, [key]: value } : term
      ),
    }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(
          () =>
            saveAcademicCalendar({
              ...form,
              terms: form.terms.map((t) => ({ ...t, name: t.name as TermName })),
            }),
          "Academic calendar saved"
        );
      }}
    >
      <StepHeader title="Session &amp; terms">
        Nigerian sessions run roughly September to July across three terms.
        These dates are prefilled — adjust them to your state&apos;s calendar.
      </StepHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="session-name">Session *</Label>
          <Input
            id="session-name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="2025/2026"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-start">Starts *</Label>
          <Input
            id="session-start"
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm((p) => ({ ...p, startDate: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-end">Ends *</Label>
          <Input
            id="session-end"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {form.terms.map((term, index) => (
          <div
            key={term.name}
            className="grid gap-4 rounded-md border border-gray-200 p-4 md:grid-cols-3"
          >
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {termLabel[term.name as TermName]}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${term.name}-start`}>Starts</Label>
              <Input
                id={`${term.name}-start`}
                type="date"
                value={term.startDate}
                onChange={(e) => setTerm(index, "startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${term.name}-end`}>Ends</Label>
              <Input
                id={`${term.name}-end`}
                type="date"
                value={term.endDate}
                onChange={(e) => setTerm(index, "endDate", e.target.value)}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <StepActions isSaving={isSaving} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

type ClassRow = {
  name: string;
  level: SchoolLevel;
  arm: string;
  stream: Stream | null;
};

const NO_STREAM = "__none__";

export function ClassesStep({
  classRooms,
}: {
  classRooms: OnboardingClassRoom[];
}) {
  const { save, isSaving } = useStepSave("grading");
  const [rows, setRows] = useState<ClassRow[]>(() =>
    classRooms.length > 0
      ? classRooms.map((c) => ({
          name: c.name,
          level: c.level,
          arm: c.arm,
          stream: c.stream,
        }))
      : DEFAULT_CLASSES.map((c) => ({
          name: c.name,
          level: c.level,
          arm: "",
          stream: null,
        }))
  );

  const update = (index: number, patch: Partial<ClassRow>) =>
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { name: "", level: SchoolLevel.JUNIOR, arm: "", stream: null },
    ]);

  const removeRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  /** Adds A/B arms to every class that currently has none. */
  const splitIntoArms = () =>
    setRows((prev) =>
      prev.flatMap((row) =>
        row.arm
          ? [row]
          : [
              { ...row, arm: "A" },
              { ...row, arm: "B" },
            ]
      )
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(() => saveClassRooms({ classRooms: rows }), "Classes saved");
      }}
    >
      <StepHeader title="Classes &amp; arms">
        The six secondary classes are prefilled. Add arms if a class runs
        parallel sets, and set a stream for senior classes that specialise.
      </StepHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Add class
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={splitIntoArms}
        >
          Split all into A &amp; B arms
        </Button>
      </div>

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid items-end gap-3 rounded-md border border-gray-200 p-3 md:grid-cols-[1fr_130px_100px_150px_40px]"
          >
            <div className="space-y-1">
              <Label htmlFor={`name-${index}`} className="text-xs">
                Class
              </Label>
              <Input
                id={`name-${index}`}
                value={row.name}
                onChange={(e) => update(index, { name: e.target.value })}
                placeholder="JSS 1"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Level</Label>
              <Select
                value={row.level}
                onValueChange={(value) =>
                  update(index, {
                    level: value as SchoolLevel,
                    // Streams only apply to senior classes.
                    stream:
                      value === SchoolLevel.JUNIOR ? null : row.stream,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SchoolLevel.JUNIOR}>Junior</SelectItem>
                  <SelectItem value={SchoolLevel.SENIOR}>Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`arm-${index}`} className="text-xs">
                Arm
              </Label>
              <Input
                id={`arm-${index}`}
                value={row.arm}
                onChange={(e) => update(index, { arm: e.target.value })}
                placeholder="A"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Stream</Label>
              <Select
                value={row.stream ?? NO_STREAM}
                disabled={row.level === SchoolLevel.JUNIOR}
                onValueChange={(value) =>
                  update(index, {
                    stream: value === NO_STREAM ? null : (value as Stream),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_STREAM}>None</SelectItem>
                  {Object.values(Stream).map((value) => (
                    <SelectItem key={value} value={value}>
                      {streamLabel[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(index)}
              aria-label={`Remove ${row.name || "class"}`}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <StepActions isSaving={isSaving} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------------

export function GradingStep({ grading }: { grading: OnboardingGrading }) {
  const { save, isSaving } = useStepSave("subjects");
  const [caWeight, setCaWeight] = useState(grading?.caWeight ?? 30);
  const [bands, setBands] = useState(() =>
    grading && grading.bands.length > 0
      ? grading.bands.map((b) => ({ ...b }))
      : WAEC_GRADE_BANDS.map((b) => ({ ...b }))
  );

  const examWeight = 100 - caWeight;

  const updateBand = (
    index: number,
    patch: Partial<(typeof bands)[number]>
  ) =>
    setBands((prev) =>
      prev.map((band, i) => (i === index ? { ...band, ...patch } : band))
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(
          () => saveGradingScale({ caWeight, examWeight, bands }),
          "Grading scale saved"
        );
      }}
    >
      <StepHeader title="Grading">
        Prefilled with the WAEC bands most schools mirror internally. C4–C6 are
        the credit grades that matter for university admission.
      </StepHeader>

      <div className="mb-6 rounded-md border border-gray-200 p-4">
        <Label htmlFor="ca-weight">Continuous assessment weight</Label>
        <div className="mt-2 flex items-center gap-3">
          <Input
            id="ca-weight"
            type="number"
            min={0}
            max={100}
            value={caWeight}
            onChange={(e) => setCaWeight(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600">
            % CA + <span className="font-medium">{examWeight}%</span> exam
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          30/70 is the common split in Nigerian secondary schools; some use
          40/60.
        </p>
      </div>

      <div className="space-y-2">
        {bands.map((band, index) => (
          <div
            key={index}
            className="grid items-end gap-3 rounded-md border border-gray-200 p-3 md:grid-cols-[80px_1fr_90px_90px_90px]"
          >
            <div className="space-y-1">
              <Label className="text-xs">Grade</Label>
              <Input
                value={band.code}
                onChange={(e) => updateBand(index, { code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Remark</Label>
              <Input
                value={band.label}
                onChange={(e) => updateBand(index, { label: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={band.minScore}
                onChange={(e) =>
                  updateBand(index, { minScore: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={band.maxScore}
                onChange={(e) =>
                  updateBand(index, { maxScore: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="flex items-center pb-2">
              <Badge
                className={
                  band.isPass
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {band.isPass ? "Pass" : "Fail"}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setCaWeight(30);
            setBands(WAEC_GRADE_BANDS.map((b) => ({ ...b })));
          }}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          Reset to WAEC defaults
        </Button>
      </div>

      <StepActions isSaving={isSaving} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------

export function SubjectsStep({ subjectCount }: { subjectCount: number }) {
  const { save, isSaving } = useStepSave("staff");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const selectAll = (names: readonly string[]) =>
    setSelected((prev) => new Set([...prev, ...names]));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(
          () => addSubjectsInBulk({ names: [...selected] }),
          `${selected.size} subject${selected.size === 1 ? "" : "s"} added`
        );
      }}
    >
      <StepHeader title="Subjects">
        Pick what the school teaches. You can add more, and assign teachers and
        classes, from the Subjects page later.
      </StepHeader>

      {subjectCount > 0 && (
        <p className="mb-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          {subjectCount} subject{subjectCount === 1 ? "" : "s"} already added.
          Anything you tick here is added alongside them; duplicates are skipped.
        </p>
      )}

      {(
        [
          ["Junior secondary", SUGGESTED_SUBJECTS.junior],
          ["Senior secondary", SUGGESTED_SUBJECTS.senior],
        ] as const
      ).map(([heading, names]) => (
        <div key={heading} className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">{heading}</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => selectAll(names)}
            >
              Select all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {names.map((name) => {
              const isOn = selected.has(name);
              return (
                <button
                  type="button"
                  key={`${heading}-${name}`}
                  onClick={() => toggle(name)}
                  aria-pressed={isOn}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    isOn
                      ? "border-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <span className="text-sm text-gray-600">
          {selected.size} selected
        </span>
        <Button
          type="submit"
          disabled={isSaving || selected.size === 0}
        >
          {isSaving ? "Saving…" : "Add subjects and continue"}
        </Button>
      </div>
    </form>
  );
}
