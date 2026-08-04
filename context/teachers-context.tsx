"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  createTeacher,
  removeTeacher as removeTeacherAction,
  updateTeacher as updateTeacherAction,
  type ActionResult,
} from "@/lib/actions/teachers";
import { runAction } from "@/lib/actions/run-action";
import { useToast } from "@/hooks/use-toast";
import type {
  ClassRoomOption,
  Teacher,
  TeacherFormData,
} from "@/types/teacher";

interface TeachersContextType {
  teachers: Teacher[];
  classRooms: ClassRoomOption[];
  addTeacher: (data: TeacherFormData) => Promise<boolean>;
  updateTeacher: (id: string, data: TeacherFormData) => Promise<boolean>;
  removeTeacher: (id: string) => Promise<boolean>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredTeachers: Teacher[];
  isPending: boolean;
}

const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

interface TeachersProviderProps {
  /**
   * Server-fetched records. The actions revalidate this route, so this prop is
   * the single source of truth — there is no mirrored client-side copy.
   */
  teachers: Teacher[];
  classRooms: ClassRoomOption[];
  children: React.ReactNode;
}

export function TeachersProvider({
  teachers,
  classRooms,
  children,
}: TeachersProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        query === "" ||
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || teacher.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teachers, searchQuery, statusFilter]);

  /** Runs an action inside a transition and surfaces failures as a toast. */
  const run = (action: () => Promise<ActionResult>) =>
    new Promise<boolean>((resolve) => {
      startTransition(async () => {
        // runAction turns an expired-session redirect (which resolves to
        // undefined) into a readable error instead of a TypeError.
        const result = await runAction(action);

        if (!result.ok) {
          toast({
            title: "Something went wrong",
            description: result.error,
            variant: "destructive",
          });
        }

        resolve(result.ok);
      });
    });

  const value: TeachersContextType = {
    teachers,
    classRooms,
    addTeacher: (data) => run(() => createTeacher(data)),
    updateTeacher: (id, data) => run(() => updateTeacherAction(id, data)),
    removeTeacher: (id) => run(() => removeTeacherAction(id)),
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredTeachers,
    isPending,
  };

  return (
    <TeachersContext.Provider value={value}>
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
