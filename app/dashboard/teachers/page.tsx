"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeachersProvider } from "@/context/teachers-context";
import { TeacherForm } from "@/components/teacher-form";
import { TeacherStats } from "@/components/teacher-stats";
import { TeachersTable } from "@/components/teachers-table";
import { SearchFilters } from "@/components/search-filters";
import { useTeachers } from "@/context/teachers-context";

function TeachersPageContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { teachers } = useTeachers();
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>
            <TeacherForm teacher={editingTeacher} onClose={handleClose} />
          </DialogContent>
        </Dialog>
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

export default function TeachersPage() {
  return (
    <TeachersProvider>
      <TeachersPageContent />
    </TeachersProvider>
  );
}
