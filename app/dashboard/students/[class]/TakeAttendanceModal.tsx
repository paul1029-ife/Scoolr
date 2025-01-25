/* eslint-disable @typescript-eslint/ban-ts-comment */
"use-client";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Student } from "./AddStudentModal";
interface TakeAttendanceModalProps {
  students: Student[];
  onUpdateAttendance: (attendanceData: {
    date: Date;
    attendance: Record<string, boolean>;
  }) => void;
}

export function TakeAttendanceModal({
  students,
  onUpdateAttendance,
}: TakeAttendanceModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceState, setAttendanceState] = useState<
    Record<string, boolean>
  >({});

  // Initialize attendance state when modal opens
  const initializeAttendance = () => {
    const initialState: Record<string, boolean> = {};
    students.forEach((student) => {
      initialState[student.id] = true; // Default all students to present
    });
    setAttendanceState(initialState);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      initializeAttendance();
    }
    setOpen(newOpen);
  };

  const handleAttendanceChange = (studentId: string, checked: boolean) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: checked,
    }));
  };

  const handleSubmit = () => {
    onUpdateAttendance({
      date,
      attendance: attendanceState,
    });
    setOpen(false);
  };

  const markAllPresent = () => {
    const newState: Record<string, boolean> = {};
    students.forEach((student) => {
      newState[student.id] = true;
    });
    setAttendanceState(newState);
  };

  const markAllAbsent = () => {
    const newState: Record<string, boolean> = {};
    students.forEach((student) => {
      newState[student.id] = false;
    });
    setAttendanceState(newState);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Take Attendance</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Take Attendance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 h-full overflow-scroll">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAbsent}>
                Mark All Absent
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead className="w-[100px]">Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={attendanceState[student.id]}
                        onCheckedChange={(checked) =>
                          //@ts-expect-error
                          handleAttendanceChange(student.id, checked as boolean)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Attendance</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
