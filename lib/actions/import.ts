"use server";

import { revalidatePath } from "next/cache";

import {
  Gender,
  GuardianRelationship,
  ImportEntity,
  SchoolLevel,
  Stream,
  SubjectLevel,
  TeacherStatus,
} from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ensurePermission } from "@/lib/tenant";
import { analyseCsv, type ImportAnalysis } from "@/lib/import/analyse";
import { ENTITY_DEFINITIONS } from "@/lib/import/definitions";

export type PreviewResult =
  | { ok: true; analysis: ImportAnalysis }
  | { ok: false; error: string };

export type CommitResult =
  | { ok: true; created: number; updated: number; skipped: number }
  | { ok: false; error: string };

/** Permission required per entity — importing staff is not the same as subjects. */
const ENTITY_PERMISSION = {
  [ImportEntity.STUDENTS]: "student:manage",
  [ImportEntity.TEACHERS]: "teacher:manage",
  [ImportEntity.GUARDIANS]: "student:manage",
  [ImportEntity.SUBJECTS]: "subject:manage",
  [ImportEntity.CLASSES]: "school:manage",
} as const;

/** Everything already stored, keyed the same way the analyser keys rows. */
async function loadExistingIdentities(
  entity: ImportEntity,
  schoolId: string
): Promise<Set<string>> {
  switch (entity) {
    case ImportEntity.STUDENTS: {
      const rows = await prisma.student.findMany({
        where: { schoolId },
        select: { registrationNumber: true },
      });
      return new Set(rows.map((r) => r.registrationNumber.toLowerCase()));
    }
    case ImportEntity.TEACHERS: {
      const rows = await prisma.teacher.findMany({
        where: { schoolId },
        select: { email: true },
      });
      return new Set(rows.map((r) => r.email.toLowerCase()));
    }
    case ImportEntity.GUARDIANS: {
      const rows = await prisma.guardian.findMany({
        where: { schoolId },
        select: { phone: true },
      });
      return new Set(rows.map((r) => r.phone.replace(/\D/g, "")));
    }
    case ImportEntity.SUBJECTS: {
      const rows = await prisma.subject.findMany({
        where: { schoolId },
        select: { name: true },
      });
      return new Set(rows.map((r) => r.name.toLowerCase()));
    }
    case ImportEntity.CLASSES: {
      const rows = await prisma.classRoom.findMany({
        where: { schoolId },
        select: { name: true, arm: true },
      });
      return new Set(
        rows.map((r) => `${r.name.toLowerCase()}|${r.arm.toLowerCase()}`)
      );
    }
  }
}

export async function previewImport(
  entity: ImportEntity,
  csv: string
): Promise<PreviewResult> {
  const permitted = await ensurePermission(ENTITY_PERMISSION[entity]);
  if (!permitted.ok) return permitted;

  const existing = await loadExistingIdentities(
    entity,
    permitted.user.schoolId
  );
  const analysis = analyseCsv({ entity, csv, existing });

  if ("ok" in analysis) return analysis;

  return { ok: true, analysis };
}

/** Maps "JSS 1" + "A" to a class id, so a row can name a class in plain text. */
async function classRoomLookup(schoolId: string) {
  const rows = await prisma.classRoom.findMany({
    where: { schoolId },
    select: { id: true, name: true, arm: true },
  });

  const byKey = new Map(
    rows.map((r) => [`${r.name.toLowerCase()}|${r.arm.toLowerCase()}`, r.id])
  );

  return (name?: string, arm?: string) =>
    byKey.get(`${(name ?? "").toLowerCase()}|${(arm ?? "").toLowerCase()}`) ??
    null;
}

export async function commitImport(
  entity: ImportEntity,
  csv: string,
  fileName: string
): Promise<CommitResult> {
  const permitted = await ensurePermission(ENTITY_PERMISSION[entity]);
  if (!permitted.ok) return permitted;

  const schoolId = permitted.user.schoolId;

  // Re-analysed server-side rather than trusting a preview the client could
  // have edited, and because the data may have changed since the preview.
  const existing = await loadExistingIdentities(entity, schoolId);
  const analysis = analyseCsv({ entity, csv, existing });
  if ("ok" in analysis) return analysis;

  const importable = analysis.rows.filter(
    (row) => row.status === "create" || row.status === "update"
  );

  if (importable.length === 0) {
    return { ok: false, error: "There are no valid rows to import." };
  }

  let created = 0;
  let updated = 0;
  const skipped =
    analysis.summary.invalid + analysis.summary.duplicate;

  const findClassRoom = await classRoomLookup(schoolId);
  const unresolved: number[] = [];

  switch (entity) {
    case ImportEntity.CLASSES: {
      for (const row of importable) {
        const v = row.value as {
          name: string;
          level: SchoolLevel;
          arm?: string;
          stream?: Stream;
        };

        const result = await prisma.classRoom.upsert({
          where: {
            schoolId_name_arm: { schoolId, name: v.name, arm: v.arm ?? "" },
          },
          update: { level: v.level, stream: v.stream ?? null },
          create: {
            schoolId,
            name: v.name,
            arm: v.arm ?? "",
            level: v.level,
            stream: v.stream ?? null,
          },
          select: { createdAt: true, updatedAt: true },
        });

        // A fresh row has matching timestamps; an updated one does not.
        if (result.createdAt.getTime() === result.updatedAt.getTime()) created += 1;
        else updated += 1;
      }
      break;
    }

    case ImportEntity.SUBJECTS: {
      for (const row of importable) {
        const v = row.value as {
          name: string;
          department?: string;
          level: SubjectLevel;
        };

        if (row.status === "create") {
          await prisma.subject.create({
            data: {
              schoolId,
              name: v.name,
              department: v.department ?? "General",
              level: v.level,
            },
          });
          created += 1;
        } else {
          await prisma.subject.updateMany({
            where: { schoolId, name: v.name },
            data: { department: v.department ?? "General", level: v.level },
          });
          updated += 1;
        }
      }
      break;
    }

    case ImportEntity.TEACHERS: {
      for (const row of importable) {
        const v = row.value as {
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          subject: string;
          class?: string;
          arm?: string;
          status: TeacherStatus;
        };

        const classRoomId = v.class ? findClassRoom(v.class, v.arm) : null;
        if (v.class && !classRoomId) unresolved.push(row.line);

        const data = {
          name: `${v.first_name} ${v.last_name}`,
          phoneNumber: v.phone,
          subject: v.subject,
          status: v.status,
          classRoomId,
        };

        if (row.status === "create") {
          await prisma.teacher.create({
            data: { schoolId, email: v.email, ...data },
          });
          created += 1;
        } else {
          await prisma.teacher.updateMany({
            where: { schoolId, email: v.email },
            data,
          });
          updated += 1;
        }
      }
      break;
    }

    case ImportEntity.STUDENTS: {
      const currentSession = await prisma.academicSession.findFirst({
        where: { schoolId, isCurrent: true },
        select: { id: true },
      });

      for (const row of importable) {
        const v = row.value as {
          admission_number: string;
          first_name: string;
          last_name: string;
          gender: Gender;
          class: string;
          arm?: string;
          date_of_birth?: Date;
          guardian_name?: string;
          guardian_phone?: string;
          guardian_relationship?: GuardianRelationship;
          address?: string;
        };

        const classRoomId = findClassRoom(v.class, v.arm);
        if (!classRoomId) {
          unresolved.push(row.line);
          continue;
        }

        const name = `${v.first_name} ${v.last_name}`;
        const student = await prisma.student.upsert({
          where: {
            schoolId_registrationNumber: {
              schoolId,
              registrationNumber: v.admission_number,
            },
          },
          update: {
            name,
            gender: v.gender,
            classRoomId,
            dateOfBirth: v.date_of_birth ?? null,
            address: v.address ?? null,
          },
          create: {
            schoolId,
            registrationNumber: v.admission_number,
            name,
            gender: v.gender,
            classRoomId,
            dateOfBirth: v.date_of_birth ?? null,
            address: v.address ?? null,
          },
          select: { id: true },
        });

        if (row.status === "create") created += 1;
        else updated += 1;

        // Record which class they sat in this session, so promotion has history.
        if (currentSession) {
          await prisma.studentEnrolment.upsert({
            where: {
              studentId_sessionId: {
                studentId: student.id,
                sessionId: currentSession.id,
              },
            },
            update: { classRoomId },
            create: {
              studentId: student.id,
              sessionId: currentSession.id,
              classRoomId,
            },
          });
        }

        // Create the family contact alongside the child when given.
        if (v.guardian_name && v.guardian_phone) {
          const [firstName, ...rest] = v.guardian_name.trim().split(/\s+/);
          const guardian = await prisma.guardian.upsert({
            where: { schoolId_phone: { schoolId, phone: v.guardian_phone } },
            update: {},
            create: {
              schoolId,
              firstName,
              lastName: rest.join(" ") || firstName,
              phone: v.guardian_phone,
            },
            select: { id: true },
          });

          await prisma.studentGuardian.upsert({
            where: {
              studentId_guardianId: {
                studentId: student.id,
                guardianId: guardian.id,
              },
            },
            update: {},
            create: {
              studentId: student.id,
              guardianId: guardian.id,
              relationship:
                v.guardian_relationship ?? GuardianRelationship.GUARDIAN,
              isPrimary: true,
            },
          });
        }
      }
      break;
    }

    case ImportEntity.GUARDIANS: {
      for (const row of importable) {
        const v = row.value as {
          first_name: string;
          last_name: string;
          phone: string;
          email?: string;
          occupation?: string;
          address?: string;
          student_admission_number?: string;
          relationship: GuardianRelationship;
        };

        const guardian = await prisma.guardian.upsert({
          where: { schoolId_phone: { schoolId, phone: v.phone } },
          update: {
            firstName: v.first_name,
            lastName: v.last_name,
            email: v.email ?? null,
            occupation: v.occupation ?? null,
            address: v.address ?? null,
          },
          create: {
            schoolId,
            firstName: v.first_name,
            lastName: v.last_name,
            phone: v.phone,
            email: v.email ?? null,
            occupation: v.occupation ?? null,
            address: v.address ?? null,
          },
          select: { id: true },
        });

        if (row.status === "create") created += 1;
        else updated += 1;

        if (v.student_admission_number) {
          const student = await prisma.student.findFirst({
            where: {
              schoolId,
              registrationNumber: v.student_admission_number,
            },
            select: { id: true },
          });

          if (!student) {
            unresolved.push(row.line);
          } else {
            await prisma.studentGuardian.upsert({
              where: {
                studentId_guardianId: {
                  studentId: student.id,
                  guardianId: guardian.id,
                },
              },
              update: { relationship: v.relationship },
              create: {
                studentId: student.id,
                guardianId: guardian.id,
                relationship: v.relationship,
              },
            });
          }
        }
      }
      break;
    }
  }

  await prisma.importJob.create({
    data: {
      schoolId,
      entity,
      fileName: fileName.slice(0, 200),
      totalRows: analysis.summary.total,
      createdCount: created,
      updatedCount: updated,
      skippedCount: skipped,
      importedById: permitted.user.id,
    },
  });

  revalidatePath("/dashboard", "layout");

  if (unresolved.length > 0) {
    const shown = unresolved.slice(0, 5).join(", ");
    return {
      ok: false,
      error: `Imported ${created + updated} row${
        created + updated === 1 ? "" : "s"
      }, but line${unresolved.length === 1 ? "" : "s"} ${shown}${
        unresolved.length > 5 ? "…" : ""
      } referenced a class or student that does not exist. Create those first, then re-import.`,
    };
  }

  return { ok: true, created, updated, skipped };
}

/** Recent imports, for the history panel. */
export async function getRecentImports() {
  const permitted = await ensurePermission("school:manage");
  if (!permitted.ok) return [];

  const jobs = await prisma.importJob.findMany({
    where: { schoolId: permitted.user.schoolId },
    select: {
      id: true,
      entity: true,
      fileName: true,
      totalRows: true,
      createdCount: true,
      updatedCount: true,
      skippedCount: true,
      createdAt: true,
      importedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return jobs.map((job) => ({
    ...job,
    label: ENTITY_DEFINITIONS[job.entity].label,
    createdAt: job.createdAt.toISOString(),
    importedByName: job.importedBy
      ? `${job.importedBy.firstName} ${job.importedBy.lastName}`.trim()
      : null,
  }));
}
