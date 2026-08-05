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
    <div className="mx-auto space-y-8">
      <div className="border-b px-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-2 items-center justify-between z-10">
        <h1 className="text-md font-medium tracking-tight">Manage Teachers</h1>
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Teacher
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
      </div>

      <div className="px-3">
        <div className="mb-8">
          <TeacherStats />
        </div>

        {/* Search and Filters with better spacing */}
        <div className="mb-6">
          <SearchFilters />
        </div>

        {/* Teachers Table Card */}
        <Card className="border-0 shadow-sm overflow-hidden rounded-lg">
          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Teachers</h2>
          </div>
          <TeachersTable onEdit={handleEdit} />
        </Card>
      </div>
    </div>
  );
}

export default TeachersPageContent;
