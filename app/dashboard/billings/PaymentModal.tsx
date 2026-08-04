"use client";

import React, { useCallback, useState } from "react";
import { FormDrawer, DrawerForm } from "@/components/common/form-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { recordPayment } from "@/lib/actions/billing";
import { runAction } from "@/lib/actions/run-action";
import {
  FeeCategory,
  PaymentMethod,
  PaymentStatus,
  feeCategoryLabel,
  paymentMethodLabel,
} from "@/types/billing";

export type StudentOption = {
  id: string;
  name: string;
  registrationNumber: string;
  classRoomId: string | null;
  className: string | null;
};

const EMPTY_FORM = {
  classRoomId: "",
  studentId: "",
  amount: "",
  category: FeeCategory.SCHOOL_FEES as FeeCategory,
  status: PaymentStatus.PAID as PaymentStatus,
  method: PaymentMethod.BANK_TRANSFER as PaymentMethod,
};

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  students: StudentOption[];
  classRooms: { id: string; name: string }[];
  termId: string | null;
}

export const PaymentModal = React.memo(
  ({
    isOpen,
    onOpenChange,
    students,
    classRooms,
    termId,
  }: PaymentModalProps) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      },
      []
    );

    const handleSelectChange = useCallback((field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        // Changing class invalidates the chosen student.
        ...(field === "classRoomId" ? { studentId: "" } : {}),
      }));
    }, []);

    const studentsInClass = formData.classRoomId
      ? students.filter((s) => s.classRoomId === formData.classRoomId)
      : students;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const amount = Number(formData.amount);

      setIsSaving(true);
      const result = await runAction(() =>
        recordPayment({
        studentId: formData.studentId,
        amountNaira: amount,
        category: formData.category,
        status: formData.status,
        method: formData.method,
          termId: termId ?? undefined,
        })
      );
      setIsSaving(false);

      if (!result.ok) {
        toast({
          title: "Could not record payment",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Payment recorded",
        description: "The receipt has been added to this term.",
      });

      setFormData(EMPTY_FORM);
      onOpenChange(false);
    };

    return (
      <FormDrawer
        open={isOpen}
        onOpenChange={onOpenChange}
        title="Record New Payment"
        description="Log a fee payment against a student for this term."
      >
        <DrawerForm
          onSubmit={handleSubmit}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || !formData.studentId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Payment"}
              </Button>
            </>
          }
        >
          <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={formData.classRoomId}
                  onValueChange={(value) =>
                    handleSelectChange("classRoomId", value)
                  }
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {classRooms.map((classRoom) => (
                        <SelectItem key={classRoom.id} value={classRoom.id}>
                          {classRoom.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Was a free-text name box, which could not be reconciled with
                  any real student record. */}
              <div className="grid gap-2">
                <Label htmlFor="studentId">Student</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) =>
                    handleSelectChange("studentId", value)
                  }
                >
                  <SelectTrigger id="studentId">
                    <SelectValue
                      placeholder={
                        studentsInClass.length
                          ? "Select student"
                          : "No students in this class"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {studentsInClass.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} · {student.registrationNumber}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Fee Type</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(FeeCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {feeCategoryLabel[category]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => handleSelectChange("method", value)}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(PaymentMethod).map((method) => (
                        <SelectItem key={method} value={method}>
                          {paymentMethodLabel[method]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Payment Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={PaymentStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={PaymentStatus.PENDING}>
                        Pending
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </DrawerForm>
      </FormDrawer>
    );
  }
);

PaymentModal.displayName = "PaymentModal";

export default PaymentModal;
