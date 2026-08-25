"use client";

import React, { useState } from "react";
import { Pencil, Search, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Metric, MetricGroup } from "@/components/common/metric";
import { PageBody, PageHeader } from "@/components/common/page-header";

import { removeGuardian } from "@/lib/actions/guardians";
import { runAction } from "@/lib/actions/run-action";
import { relationshipLabel, type GuardianRecord } from "@/types/guardian";

import {
  AddGuardianButton,
  GuardianDrawer,
  type LinkableStudent,
} from "./GuardianDrawer";

export function GuardiansPageContent({
  guardians,
  students,
}: {
  guardians: GuardianRecord[];
  students: LinkableStudent[];
}) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<GuardianRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const query = searchTerm.toLowerCase();
  const filtered = guardians.filter(
    (guardian) =>
      guardian.fullName.toLowerCase().includes(query) ||
      guardian.phone.includes(query) ||
      guardian.students.some((s) =>
        s.studentName.toLowerCase().includes(query)
      )
  );

  const linkedStudentCount = new Set(
    guardians.flatMap((g) => g.students.map((s) => s.studentId))
  ).size;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await runAction(() => removeGuardian(id));
    setDeletingId(null);

    if (!result.ok) {
      toast({
        title: "Could not remove guardian",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Guardian removed" });
  };

  return (
    <>
      <PageHeader
        title="Parents & guardians"
        description="Who to contact for each student"
        actions={<AddGuardianButton students={students} />}
      />

      <PageBody>
        <MetricGroup columns={3} className="mb-5">
          <Metric label="Guardians" value={guardians.length} />
          <Metric label="Students linked" value={linkedStudentCount} />
          <Metric
            label="Not yet linked"
            value={Math.max(students.length - linkedStudentCount, 0)}
          />
        </MetricGroup>

        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone or child…"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="overflow-hidden rounded-lg border-0 shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">All Guardians</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      {guardians.length === 0 ? (
                        <span className="inline-flex flex-col items-center gap-2">
                          <Users className="size-8 text-muted-foreground/50" />
                          No guardians yet. Add one, or bring them in from the
                          Import page.
                        </span>
                      ) : (
                        "No guardians match your search."
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((guardian) => (
                  <TableRow key={guardian.id}>
                    <TableCell className="font-medium">
                      {guardian.fullName}
                      {guardian.email && (
                        <span className="block text-xs text-muted-foreground">
                          {guardian.email}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{guardian.phone}</TableCell>
                    <TableCell>
                      {guardian.students.length === 0 ? (
                        <span className="text-muted-foreground">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {guardian.students.map((link) => (
                            <Badge
                              key={link.studentId}
                              variant="secondary"
                              className="font-normal"
                            >
                              {link.studentName}
                              <span className="ml-1 text-muted-foreground">
                                ({relationshipLabel[link.relationship]})
                              </span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {guardian.occupation ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditing(guardian)}
                          aria-label={`Edit ${guardian.fullName}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deletingId === guardian.id}
                              aria-label={`Remove ${guardian.fullName}`}
                              className="text-muted-foreground hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove guardian
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove {guardian.fullName}? Their children stay
                                on the roll — only the contact and its links are
                                deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDelete(guardian.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </PageBody>

      {editing && (
        <GuardianDrawer
          key={editing.id}
          guardian={editing}
          students={students}
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      )}
    </>
  );
}

export default GuardiansPageContent;
