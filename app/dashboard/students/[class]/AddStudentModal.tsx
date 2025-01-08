"use client";

import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export interface Student {
  id: number | string;
  name: string;
  registrationNumber: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  attendance: {
    present: number;
    absent?: number;
    late?: number;
    total: number;
  };
}

export function AddStudentModal({
  onAddStudent,
}: {
  onAddStudent: (student: Student) => void;
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    gender: "",
    guardianName: "",
    guardianPhone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      attendance: {
        present: 0,
        total: 0,
      },
    };

    onAddStudent(newStudent);
    setFormData({
      name: "",
      registrationNumber: "",
      gender: "",
      guardianName: "",
      guardianPhone: "",
    });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              required
              value={formData.registrationNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name</Label>
            <Input
              id="guardianName"
              name="guardianName"
              required
              value={formData.guardianName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              name="guardianPhone"
              type="tel"
              required
              value={formData.guardianPhone}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
