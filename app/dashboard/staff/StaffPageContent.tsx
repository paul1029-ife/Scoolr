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
import SimpleCard from "@/components/common/simple-card";

import { updateUserRole } from "@/lib/actions/staff";
import { runAction } from "@/lib/actions/run-action";
import { revokeInvitation } from "@/lib/actions/invitations";
import { InviteStaffDrawer } from "./InviteStaffDrawer";
import { Role, roleLabel } from "@/lib/auth/permissions";
import type { StaffList } from "@/lib/queries/staff";

const ROLE_BADGE: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "bg-purple-100 text-purple-800",
  [Role.ADMIN]: "bg-blue-100 text-blue-800",
  [Role.TEACHER]: "bg-green-100 text-green-800",
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
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-md font-medium tracking-tight">Staff Accounts</h1>
        <InviteStaffDrawer canInviteSuperAdmin={viewerIsSuperAdmin} />
      </div>

      <div className="px-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SimpleCard title="Accounts" value={`${members.length}`} />
          <SimpleCard title="Administrators" value={`${adminCount}`} />
          <SimpleCard
            title="Teachers"
            value={`${
              members.filter((member) => member.role === Role.TEACHER).length
            }`}
          />
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            These are sign-in accounts and what each may do. Staff records live
            on the{" "}
            <span className="font-medium">Teachers</span> page — an account and
            a staff record are separate until they are linked.
          </p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {invitations.length > 0 && (
          <Card className="mb-6 border-0 shadow-sm overflow-hidden rounded-lg">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
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
                          ? "bg-gray-100 text-gray-600"
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

        <Card className="border-0 shadow-sm overflow-hidden rounded-lg">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Accounts</h2>
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
      </div>
    </div>
  );
}

export default StaffPageContent;
