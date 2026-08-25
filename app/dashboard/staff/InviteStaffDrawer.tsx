"use client";

import React, { useState } from "react";
import { UserPlus, Copy, Check } from "lucide-react";

import { FormDrawer, DrawerForm } from "@/components/common/form-drawer";
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

import { inviteStaff } from "@/lib/actions/invitations";
import { runAction } from "@/lib/actions/run-action";
import { Role, roleLabel } from "@/lib/auth/permissions";

export function InviteStaffDrawer({
  canInviteSuperAdmin,
}: {
  canInviteSuperAdmin: boolean;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(Role.TEACHER);
  /** Set when email is not configured, so the link can be shared by hand. */
  const [manualLink, setManualLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const assignableRoles = Object.values(Role).filter(
    (value) => value !== Role.SUPER_ADMIN || canInviteSuperAdmin
  );

  const reset = () => {
    setEmail("");
    setRole(Role.TEACHER);
    setManualLink(null);
    setCopied(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    const result = await runAction(() => inviteStaff({ email, role }));
    setIsSaving(false);

    if (!result.ok) {
      toast({
        title: "Could not send invitation",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.delivered) {
      toast({
        title: "Invitation sent",
        description: `An email is on its way to ${email}.`,
      });
      reset();
      setOpen(false);
      return;
    }

    // Email is not configured — be honest and hand over the link instead of
    // claiming a message was sent.
    setManualLink(result.acceptUrl);
    toast({
      title: "Invitation created",
      description: "Email is not set up yet, so share the link manually.",
    });
  };

  const copyLink = async () => {
    if (!manualLink) return;
    await navigator.clipboard.writeText(manualLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        setOpen(next);
      }}
      title="Invite a colleague"
      description="They'll get a link to create an account with the role you choose."
      trigger={
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Staff
        </Button>
      }
    >
      <DrawerForm
        onSubmit={handleSubmit}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isSaving}
            >
              {manualLink ? "Done" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !email}
            >
              {isSaving ? "Sending..." : "Send invitation"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@school.edu.ng"
              autoComplete="off"
              required
            />
            <p className="text-xs text-muted-foreground">
              The invitation only works for this exact address.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as Role)}
            >
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignableRoles.map((value) => (
                  <SelectItem key={value} value={value}>
                    {roleLabel[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {manualLink && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-900">
                Email is not configured
              </p>
              <p className="mt-1 text-xs text-amber-800">
                No message was sent. Share this link with them directly — it
                expires in 7 days.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-background px-2 py-1 text-xs text-foreground">
                  {manualLink}
                </code>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyLink}
                  aria-label="Copy invitation link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerForm>
    </FormDrawer>
  );
}

export default InviteStaffDrawer;
