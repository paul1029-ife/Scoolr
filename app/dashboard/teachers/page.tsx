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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-100">
      {/* Header with Add Teacher Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Teachers Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, and manage faculty members
          </p>
        </div>
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

      {/* Stats Section with improved visual design */}
      <div className="mb-8">
        <TeacherStats />
      </div>

      {/* Search and Filters with better spacing */}
      <div className="mb-6">
        <SearchFilters />
      </div>

      {/* Teachers Table Card */}
      <Card className="border-0 shadow-sm overflow-hidden rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Teachers</h2>
        </div>
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
