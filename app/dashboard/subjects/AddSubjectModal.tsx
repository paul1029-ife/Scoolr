"use client";

import React, { useState, useEffect } from "react";
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
    // Get existing subjects from localStorage
    const existingSubjects = JSON.parse(
      localStorage.getItem("subjects") || "[]"
    );

    // Create new subject with unique ID
    const newSubject = {
      ...formData,
      id: Date.now().toString(),
    };

    // Add new subject to array
    const updatedSubjects = [...existingSubjects, newSubject];

    // Save back to localStorage
    localStorage.setItem("subjects", JSON.stringify(updatedSubjects));

    // Show success toast
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter subject name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange(value, "department")}
            >
              <SelectTrigger>
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
            <Label htmlFor="teacher">Teacher Name *</Label>
            <Input
              id="teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
              placeholder="Enter teacher name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="students">Number of Students</Label>
            <Input
              id="students"
              name="students"
              type="number"
              value={formData.students || ""}
              onChange={handleInputChange}
              placeholder="Enter number of students"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => handleSelectChange(value, "level")}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleInputChange}
              placeholder="e.g., Mon, Wed, Fri"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="e.g., 9:00 AM - 10:30 AM"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectModal;
