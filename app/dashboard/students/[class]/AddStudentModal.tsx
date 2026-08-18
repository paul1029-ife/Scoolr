"use client";

import React from "react";
import { useState } from "react";
import { FormDrawer, DrawerForm } from "@/components/common/form-drawer";
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

import { createStudent } from "@/lib/actions/students";
import { runAction } from "@/lib/actions/run-action";
import { useToast } from "@/hooks/use-toast";
import { Gender, genderLabel } from "@/types/student";

interface FormErrors {
  name?: string;
  registrationNumber?: string;
  gender?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export function AddStudentModal({ classRoomId }: { classRoomId: string }) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    gender: "",
    guardianName: "",
    guardianPhone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]*$/.test(value))
          return "Name can only contain letters and spaces";
        return "";

      case "registrationNumber":
        if (!value.trim()) return "Registration number is required";
        if (value.length < 5)
          return "Registration number must be at least 5 characters";
        if (!/^[A-Z0-9-]*$/.test(value))
          return "Registration number can only contain uppercase letters, numbers, and hyphens";
        return "";

      case "gender":
        if (!value) return "Gender is required";
        return "";

      // A guardian is optional, but half a contact is worse than none — if
      // either field is filled, both must be.
      case "guardianName":
        if (!value.trim())
          return formData.guardianPhone.trim()
            ? "Add the guardian's name too"
            : "";
        if (value.trim().length < 2)
          return "Guardian name must be at least 2 characters";
        if (!/^[a-zA-Z\s]*$/.test(value))
          return "Guardian name can only contain letters and spaces";
        return "";

      case "guardianPhone":
        if (!value.trim())
          return formData.guardianName.trim()
            ? "Add the guardian's phone number too"
            : "";
        if (!/^\+?[\d\s-]{10,}$/.test(value)) {
          return "Please enter a valid phone number (minimum 10 digits)";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mark all fields as touched to show errors
      const touchedFields: Record<string, boolean> = {};
      Object.keys(formData).forEach((key) => {
        touchedFields[key] = true;
      });
      setTouched(touchedFields);
      return;
    }

    setIsSaving(true);
    const result = await runAction(() =>
      createStudent(classRoomId, {
      ...formData,
        gender: formData.gender as Gender,
      })
    );
    setIsSaving(false);

    if (!result.ok) {
      // Keep the dialog open so the entered details aren't lost.
      toast({
        title: "Could not add student",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setFormData({
      name: "",
      registrationNumber: "",
      gender: "",
      guardianName: "",
      guardianPhone: "",
    });
    setErrors({});
    setTouched({});
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const value = formData[fieldName as keyof typeof formData];
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  return (
    <FormDrawer
      open={open}
      onOpenChange={setOpen}
      title="Add New Student"
      description="Enrol a student into this class."
      trigger={
        <Button className="flex items-center gap-2 hover:">
          <UserPlus className="h-4 w-4" />
          Add New Student
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
              disabled={isSaving}
              onClick={() => {
                setOpen(false);
                setErrors({});
                setTouched({});
                setFormData({
                  name: "",
                  registrationNumber: "",
                  gender: "",
                  guardianName: "",
                  guardianPhone: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Adding..." : "Add Student"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            {errors.name && touched.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              required
              value={formData.registrationNumber}
              onChange={handleChange}
              onBlur={() => handleBlur("registrationNumber")}
              className={
                errors.registrationNumber && touched.registrationNumber
                  ? "border-red-500"
                  : ""
              }
            />
            {errors.registrationNumber && touched.registrationNumber && (
              <p className="text-sm text-red-500">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, gender: value }));
                if (touched.gender) {
                  const error = validateField("gender", value);
                  setErrors((prev) => ({ ...prev, gender: error }));
                }
              }}
              onOpenChange={() => handleBlur("gender")}
            >
              <SelectTrigger
                className={
                  errors.gender && touched.gender ? "border-red-500" : ""
                }
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Gender).map((value) => (
                  <SelectItem key={value} value={value}>
                    {genderLabel[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && touched.gender && (
              <p className="text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name (optional)</Label>
            <Input
              id="guardianName"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              onBlur={() => handleBlur("guardianName")}
              className={
                errors.guardianName && touched.guardianName
                  ? "border-red-500"
                  : ""
              }
            />
            {errors.guardianName && touched.guardianName && (
              <p className="text-sm text-red-500">{errors.guardianName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              name="guardianPhone"
              type="tel"
              value={formData.guardianPhone}
              onChange={handleChange}
              onBlur={() => handleBlur("guardianPhone")}
              className={
                errors.guardianPhone && touched.guardianPhone
                  ? "border-red-500"
                  : ""
              }
            />
            {errors.guardianPhone && touched.guardianPhone && (
              <p className="text-sm text-red-500">{errors.guardianPhone}</p>
            )}
          </div>

        </div>
      </DrawerForm>
    </FormDrawer>
  );
}
