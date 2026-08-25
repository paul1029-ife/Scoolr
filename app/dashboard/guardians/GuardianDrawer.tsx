"use client";

import React, { useState } from "react";
import { Link2, Trash2, UserPlus } from "lucide-react";

import { DrawerForm, FormDrawer } from "@/components/common/form-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  createGuardian,
  linkStudentToGuardian,
  unlinkStudentFromGuardian,
  updateGuardian,
} from "@/lib/actions/guardians";
import {
  GuardianRelationship,
  relationshipLabel,
  type GuardianRecord,
} from "@/types/guardian";

export type LinkableStudent = {
  id: string;
  name: string;
  registrationNumber: string;
  className: string | null;
};

const EMPTY = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  occupation: "",
  address: "",
};

export function GuardianDrawer({
  guardian,
  students,
  open,
  onOpenChange,
  trigger,
}: {
  guardian?: GuardianRecord;
  students: LinkableStudent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [studentToLink, setStudentToLink] = useState("");
  const [relationship, setRelationship] = useState<GuardianRelationship>(
    GuardianRelationship.GUARDIAN
  );
  const [form, setForm] = useState(() =>
    guardian
      ? {
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          phone: guardian.phone,
          email: guardian.email ?? "",
          occupation: guardian.occupation ?? "",
          address: guardian.address ?? "",
        }
      : EMPTY
  );

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const linkedIds = new Set(guardian?.students.map((s) => s.studentId) ?? []);
  const available = students.filter((s) => !linkedIds.has(s.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await runAction(() =>
      guardian ? updateGuardian(guardian.id, form) : createGuardian(form)
    );
    setIsSaving(false);

    if (!result.ok) {
      toast({
        title: guardian ? "Could not update guardian" : "Could not add guardian",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: guardian ? "Guardian updated" : "Guardian added" });
    if (!guardian) setForm(EMPTY);
    onOpenChange(false);
  };

  const handleLink = async () => {
    if (!guardian || !studentToLink) return;

    setLinkingId(studentToLink);
    const result = await runAction(() =>
      linkStudentToGuardian(guardian.id, studentToLink, relationship)
    );
    setLinkingId(null);

    if (!result.ok) {
      toast({
        title: "Could not link student",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setStudentToLink("");
    toast({ title: "Student linked" });
  };

  const handleUnlink = async (studentId: string) => {
    if (!guardian) return;

    setLinkingId(studentId);
    const result = await runAction(() =>
      unlinkStudentFromGuardian(guardian.id, studentId)
    );
    setLinkingId(null);

    if (!result.ok) {
      toast({
        title: "Could not unlink",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Student unlinked" });
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={guardian ? "Edit guardian" : "Add guardian"}
      description={
        guardian
          ? "Update contact details, or link the children they're responsible for."
          : "Add a parent or guardian. You can link their children once saved."
      }
      trigger={trigger}
    >
      <DrawerForm
        onSubmit={handleSubmit}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : guardian ? "Save changes" : "Add guardian"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="08031234567"
              required
            />
            <p className="text-xs text-muted-foreground">
              This identifies the guardian — siblings sharing a parent share
              this number.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={form.occupation}
                onChange={(e) => set("occupation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </div>
          </div>

          {/* Linking needs a saved guardian to attach to. */}
          {guardian && (
            <div className="border-t pt-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Children
              </h3>

              {guardian.students.length === 0 ? (
                <p className="mb-3 text-sm text-muted-foreground">
                  No students linked yet.
                </p>
              ) : (
                <ul className="mb-3 space-y-2">
                  {guardian.students.map((link) => (
                    <li
                      key={link.studentId}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {link.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {link.registrationNumber}
                          {link.className ? ` · ${link.className}` : ""} ·{" "}
                          {relationshipLabel[link.relationship]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {link.isPrimary && (
                          <Badge variant="secondary">
                            Primary
                          </Badge>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={linkingId === link.studentId}
                          onClick={() => handleUnlink(link.studentId)}
                          aria-label={`Unlink ${link.studentName}`}
                          className="text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[180px] flex-1 space-y-1">
                  <Label className="text-xs">Link a student</Label>
                  <Select
                    value={studentToLink}
                    onValueChange={setStudentToLink}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          available.length ? "Select student" : "None available"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {available.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} · {student.registrationNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[140px] space-y-1">
                  <Label className="text-xs">Relationship</Label>
                  <Select
                    value={relationship}
                    onValueChange={(v) =>
                      setRelationship(v as GuardianRelationship)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GuardianRelationship).map((value) => (
                        <SelectItem key={value} value={value}>
                          {relationshipLabel[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLink}
                  disabled={!studentToLink || linkingId !== null}
                >
                  <Link2 className="mr-1 h-4 w-4" />
                  Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerForm>
    </FormDrawer>
  );
}

export function AddGuardianButton({
  students,
}: {
  students: LinkableStudent[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <GuardianDrawer
      students={students}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Guardian
        </Button>
      }
    />
  );
}

export default GuardianDrawer;
