"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import type { Teacher, TeacherFormData } from "@/types/teacher";

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (data: TeacherFormData) => void;
  updateTeacher: (id: string, data: TeacherFormData) => void;
  removeTeacher: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredTeachers: Teacher[];
}

const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

export function TeachersProvider({ children }: { children: React.ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Dr. Oluwaseun Adeleke",
      subject: "Mathematics",
      classAssigned: "SSS 3",
      phoneNumber: "+234 801 234 5678",
      email: "adeleke.o@school.edu.ng",
      status: "active",
    },
    {
      id: "2",
      name: "Mrs. Chioma Okafor",
      subject: "Biology",
      classAssigned: "SSS 2",
      phoneNumber: "+234 802 345 6789",
      email: "okafor.c@school.edu.ng",
      status: "active",
    },
    {
      id: "3",
      name: "Mr. Ibrahim Musa",
      subject: "Physics",
      classAssigned: "SSS 1",
      phoneNumber: "+234 803 456 7890",
      email: "musa.i@school.edu.ng",
      status: "on leave",
    },
    {
      id: "4",
      name: "Mr. David Amusan",
      subject: "Biology",
      classAssigned: "SSS 2",
      phoneNumber: "+234 823 312 7890",
      email: "david.i@school.edu.ng",
      status: "active",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const addTeacher = useCallback((data: TeacherFormData) => {
    setTeachers((prev) => [
      ...prev,
      { ...data, id: (prev.length + 1).toString() },
    ]);
  }, []);

  const updateTeacher = useCallback((id: string, data: TeacherFormData) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, ...data } : teacher
      )
    );
  }, []);

  const removeTeacher = useCallback((id: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || teacher.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <TeachersContext.Provider
      value={{
        teachers,
        addTeacher,
        updateTeacher,
        removeTeacher,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        filteredTeachers,
      }}
    >
      {children}
    </TeachersContext.Provider>
  );
}

export function useTeachers() {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error("useTeachers must be used within a TeachersProvider");
  }
  return context;
}
