"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormDrawer } from "@/components/common/form-drawer";
import { TeacherForm } from "@/components/teacher-form";
import { TeacherStats } from "@/components/teacher-stats";
import { TeachersTable } from "@/components/teachers-table";
import { SearchFilters } from "@/components/search-filters";
import { PageBody, PageHeader } from "@/components/common/page-header";
import { useTeachers } from "@/context/teachers-context";
import { useCan } from "@/components/auth/permissions-provider";

export function TeachersPageContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { teachers } = useTeachers();
  const canManage = useCan("teacher:manage");
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  const editingTeacher = editingTeacherId
    ? teachers.find((t) => t.id === editingTeacherId)
    : undefined;

  const handleEdit = (teacherId: string) => {
    setEditingTeacherId(teacherId);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingTeacherId(null);
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        description="Staff teaching at your school"
        actions={
          <FormDrawer
          open={isDialogOpen}
          onOpenChange={(open) => (open ? setIsDialogOpen(true) : handleClose())}
          title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          description={
            editingTeacher
              ? "Update this teacher's details."
              : "Add a member of staff to your school."
          }
            trigger={
              canManage ? (
                <Button>
                  <UserPlus />
                  Add teacher
                </Button>
              ) : undefined
            }
          >
            <TeacherForm
              // Remount the form when switching records so react-hook-form
              // picks up the new defaults.
              key={editingTeacher?.id ?? "new"}
              teacher={editingTeacher}
              onClose={handleClose}
            />
          </FormDrawer>
        }
      />

      <PageBody className="space-y-5">
        <TeacherStats />
        <SearchFilters />
        <Card className="overflow-hidden">
          <TeachersTable onEdit={handleEdit} />
        </Card>
      </PageBody>
    </>
  );
}

export default TeachersPageContent;
