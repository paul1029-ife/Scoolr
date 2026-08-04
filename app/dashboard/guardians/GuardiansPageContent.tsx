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
import SimpleCard from "@/components/common/simple-card";

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
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-md font-medium tracking-tight">
          Parents &amp; Guardians
        </h1>
        <AddGuardianButton students={students} />
      </div>

      <div className="px-3">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SimpleCard title="Guardians" value={`${guardians.length}`} />
          <SimpleCard title="Students linked" value={`${linkedStudentCount}`} />
          <SimpleCard
            title="Not yet linked"
            value={`${Math.max(students.length - linkedStudentCount, 0)}`}
          />
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone or child…"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="overflow-hidden rounded-lg border-0 shadow-sm">
          <div className="border-b border-gray-200 bg-gray-100 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">All Guardians</h2>
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
                          <Users className="h-8 w-8 text-gray-300" />
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
                              <span className="ml-1 text-gray-500">
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
                              className="text-gray-400 hover:text-red-600"
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
      </div>

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
    </div>
  );
}

export default GuardiansPageContent;
