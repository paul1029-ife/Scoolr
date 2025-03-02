"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface Subject {
  id: string;
  name: string;
  department: string;
  teacher: string;
  students: number;
  level: string;
  schedule: string;
  time: string;
}

const AddSubjectModal = ({
  onSubjectAdded,
}: {
  onSubjectAdded: () => void;
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Subject>({
    id: "",
    name: "",
    department: "",
    teacher: "",
    students: 0,
    level: "",
    schedule: "",
    time: "",
  });

  const departments = [
    "Sciences",
    "Humanities",
    "Religious Studies",
    "Arts",
    "Physical Education",
  ];
  const levels = ["Junior", "Senior", "All Levels"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "students" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSubject = () => {
    const existingSubjects = JSON.parse(
      localStorage.getItem("subjects") || "[]"
    );

    const newSubject = {
      ...formData,
      id: Date.now().toString(),
    };

    const updatedSubjects = [...existingSubjects, newSubject];

    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    toast({
      title: "Subject Added",
      description: "The subject has been successfully added to the system.",
    });

    // Reset form and close modal
    setFormData({
      id: "",
      name: "",
      department: "",
      teacher: "",
      students: 0,
      level: "",
      schedule: "",
      time: "",
    });
    setOpen(false);

    // Trigger refresh of subjects list
    onSubjectAdded();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.teacher) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    saveSubject();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Add New Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md md:max-w-lg lg:max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Add New Subject
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
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
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="font-medium">
                Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange(value, "level")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="teacher" className="font-medium">
                Teacher Name *
              </Label>
              <Input
                id="teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleInputChange}
                placeholder="Enter teacher name"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="students" className="font-medium">
                Number of Students
              </Label>
              <Input
                id="students"
                name="students"
                type="number"
                value={formData.students || ""}
                onChange={handleInputChange}
                placeholder="Enter number"
                className="w-full"
              />
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

          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Save Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectModal;
