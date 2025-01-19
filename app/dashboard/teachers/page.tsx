"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teachers Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>
            <TeacherForm teacher={editingTeacher} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>

      <TeacherStats />
      <SearchFilters />

      <Card>
        <TeachersTable onEdit={handleEdit} />
      </Card>
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
