"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Metric, MetricGroup } from "@/components/common/metric";
import { PageBody, PageHeader } from "@/components/common/page-header";

import { updateUserRole } from "@/lib/actions/staff";
import { runAction } from "@/lib/actions/run-action";
import { revokeInvitation } from "@/lib/actions/invitations";
import { InviteStaffDrawer } from "./InviteStaffDrawer";
import { Role, roleLabel } from "@/lib/auth/permissions";
import type { StaffList } from "@/lib/queries/staff";

const ROLE_BADGE: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "border-primary/20 bg-primary/10 text-primary",
  [Role.ADMIN]: "border-border bg-muted text-foreground",
  [Role.TEACHER]: "border-border bg-muted text-muted-foreground",
  [Role.PARENT]: "bg-amber-100 text-amber-800",
  [Role.STUDENT]: "bg-gray-100 text-gray-700",
};

export function StaffPageContent({ staff }: { staff: StaffList }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const { members, invitations, adminCount, viewerIsSuperAdmin } = staff;

  const query = searchTerm.toLowerCase();
  const filtered = members.filter(
    (member) =>
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
  );

  const isLastAdmin = (role: Role) =>
    adminCount <= 1 && (role === Role.ADMIN || role === Role.SUPER_ADMIN);

  const handleRoleChange = async (userId: string, role: Role) => {
    setSavingId(userId);
    const result = await runAction(() => updateUserRole(userId, role));
    setSavingId(null);

    if (!result.ok) {
      toast({
        title: "Could not change role",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role updated",
      description: `This account is now ${roleLabel[role].toLowerCase()}.`,
    });
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    const result = await runAction(() => revokeInvitation(id));
    setRevokingId(null);

    if (!result.ok) {
      toast({
        title: "Could not revoke invitation",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Invitation revoked" });
  };

  /** Roles this viewer may assign to this member. */
  const assignableRoles = (memberRole: Role) =>
    Object.values(Role).filter((role) => {
      if (role === Role.SUPER_ADMIN) {
        // Keep an existing super admin visible in its own select.
        return viewerIsSuperAdmin || memberRole === Role.SUPER_ADMIN;
      }
      return true;
    });

  return (
    <>
      <PageHeader
        title="Staff accounts"
        description="Who can sign in, and what they may do"
        actions={<InviteStaffDrawer canInviteSuperAdmin={viewerIsSuperAdmin} />}
      />

      <PageBody>
        <MetricGroup columns={3} className="mb-5">
          <Metric label="Accounts" value={members.length} />
          <Metric label="Administrators" value={adminCount} />
          <Metric
            label="Teachers"
            value={
              members.filter((member) => member.role === Role.TEACHER).length
            }
          />
        </MetricGroup>

        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3 text-[13px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>
            These are sign-in accounts and what each may do. Staff records live
            on the{" "}
            <span className="font-medium">Teachers</span> page — an account and
            a staff record are separate until they are linked.
          </p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {invitations.length > 0 && (
          <Card className="mb-6 overflow-hidden">
            <div className="border-b border-border px-5 py-3.5">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Pending Invitations
              </h2>
            </div>
            <div className="divide-y">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {invitation.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invited as {roleLabel[invitation.role].toLowerCase()} ·{" "}
                      {invitation.isExpired
                        ? "expired"
                        : `expires ${new Date(
                            invitation.expiresAt
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        invitation.isExpired
                          ? "bg-gray-100 text-muted-foreground"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {invitation.isExpired ? "Expired" : "Pending"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={revokingId === invitation.id}
                      onClick={() => handleRevoke(invitation.id)}
                    >
                      {revokingId === invitation.id ? "Removing..." : "Revoke"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">All Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Staff record</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                    >
                      No accounts match your search.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((member) => {
                  const locked = member.isSelf || isLastAdmin(member.role);

                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {[member.firstName, member.lastName]
                          .filter(Boolean)
                          .join(" ")}
                        {member.isSelf && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell>
                        {member.teacherName ?? (
                          <span className="text-muted-foreground">
                            Not linked
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(member.joinedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {locked ? (
                            <Badge className={ROLE_BADGE[member.role]}>
                              {roleLabel[member.role]}
                            </Badge>
                          ) : (
                            <Select
                              value={member.role}
                              disabled={savingId === member.id}
                              onValueChange={(value) =>
                                handleRoleChange(member.id, value as Role)
                              }
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {assignableRoles(member.role).map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {roleLabel[role]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {member.isSelf && (
                            <span className="text-xs text-muted-foreground">
                              Cannot change own role
                            </span>
                          )}
                          {!member.isSelf && isLastAdmin(member.role) && (
                            <span className="text-xs text-muted-foreground">
                              Last administrator
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </PageBody>
    </>
  );
}

export default StaffPageContent;
