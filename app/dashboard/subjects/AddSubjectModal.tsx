"use client";

import React, { useState } from "react";
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

import { createSubject } from "@/lib/actions/subjects";
import { runAction } from "@/lib/actions/run-action";
import { DEPARTMENTS, SubjectLevel, subjectLevelLabel } from "@/types/subject";

const EMPTY_FORM = {
  name: "",
  department: "",
  level: "" as SubjectLevel | "",
  teacherId: "",
  classRoomId: "",
  schedule: "",
  time: "",
};

const AddSubjectModal = ({
  teachers,
  classRooms,
}: {
  teachers: { id: string; name: string }[];
  classRooms: { id: string; name: string; arm: string }[];
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.department || !formData.level) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const result = await runAction(() =>
      createSubject({
      name: formData.name,
      department: formData.department,
      level: formData.level as SubjectLevel,
      teacherId: formData.teacherId || undefined,
      classRoomId: formData.classRoomId || undefined,
      schedule: formData.schedule || undefined,
        time: formData.time || undefined,
      })
    );
    setIsSaving(false);

    if (!result.ok) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subject Added",
      description: "The subject has been successfully added to the system.",
    });

    setFormData(EMPTY_FORM);
    setOpen(false);
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={setOpen}
      title="Add New Subject"
      description="Create a subject and optionally timetable it to a class."
      width="lg"
      trigger={
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Subject
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
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? "Saving..." : "Save Subject"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name" className="font-medium">
                Subject Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter subject name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="font-medium">
                Department *
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleSelectChange(value, "department")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="font-medium">
                Level *
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange(value, "level")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SubjectLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {subjectLevelLabel[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="teacherId" className="font-medium">
                Teacher
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) =>
                  handleSelectChange(value, "teacherId")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      teachers.length
                        ? "Select teacher"
                        : "No teachers added yet"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Replaces the old free-typed student count: enrolment is derived
                from the class this subject is taught to. */}
            <div className="space-y-2">
              <Label htmlFor="classRoomId" className="font-medium">
                Class
              </Label>
              <Select
                value={formData.classRoomId}
                onValueChange={(value) =>
                  handleSelectChange(value, "classRoomId")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classRooms.map((classRoom) => (
                    <SelectItem key={classRoom.id} value={classRoom.id}>
                      {[classRoom.name, classRoom.arm]
                        .filter(Boolean)
                        .join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule" className="font-medium">
                Schedule
              </Label>
              <Input
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                placeholder="e.g., Mon, Wed, Fri"
                className="w-full"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="time" className="font-medium">
                Time
              </Label>
              <Input
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 9:00 AM - 10:30 AM"
                className="w-full"
              />
            </div>
          </div>

      </DrawerForm>
    </FormDrawer>
  );
};

export default AddSubjectModal;
