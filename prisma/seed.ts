import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";
import {
  AttendanceStatus,
  EventStatus,
  FeeCategory,
  Gender,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  SchoolLevel,
  SubjectLevel,
  TeacherStatus,
  TermName,
} from "../lib/generated/prisma/enums";

/**
 * Seeds the sample records the dashboard used to hold in hardcoded arrays, so a
 * freshly migrated database looks the same as the pre-database prototype.
 * Idempotent — safe to re-run.
 */

const connectionString =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env before seeding."
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/**
 * The tenant everything is seeded under. Must match `SCOOLR_SCHOOL_SLUG` in
 * `.env`, which is what the app resolves the current school by.
 */
const SCHOOL_SLUG = process.env.SCOOLR_SCHOOL_SLUG ?? "demo-secondary-school";

/** "triumphant_baptist_college" -> "Triumphant Baptist College" */
const SCHOOL_NAME =
  process.env.SCOOLR_SCHOOL_NAME ??
  SCHOOL_SLUG.split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

// From app/dashboard/students/page.tsx
const classes = [
  { name: "JSS 1", level: SchoolLevel.JUNIOR, formTeacher: "Mrs. Adebayo" },
  { name: "JSS 2", level: SchoolLevel.JUNIOR, formTeacher: "Mr. Okonkwo" },
  { name: "JSS 3", level: SchoolLevel.JUNIOR, formTeacher: "Mrs. Okafor" },
  { name: "SSS 1", level: SchoolLevel.SENIOR, formTeacher: "Mr. Nnamdi" },
  { name: "SSS 2", level: SchoolLevel.SENIOR, formTeacher: "Mrs. Eze" },
  { name: "SSS 3", level: SchoolLevel.SENIOR, formTeacher: "Mr. Olawale" },
];

// From context/teachers-context.tsx
const teachers = [
  {
    name: "Dr. Oluwaseun Adeleke",
    subject: "Mathematics",
    className: "SSS 3",
    phoneNumber: "+234 801 234 5678",
    email: "adeleke.o@school.edu.ng",
    status: TeacherStatus.ACTIVE,
  },
  {
    name: "Mrs. Chioma Okafor",
    subject: "Biology",
    className: "SSS 2",
    phoneNumber: "+234 802 345 6789",
    email: "okafor.c@school.edu.ng",
    status: TeacherStatus.ACTIVE,
  },
  {
    name: "Mr. Ibrahim Musa",
    subject: "Physics",
    className: "SSS 1",
    phoneNumber: "+234 803 456 7890",
    email: "musa.i@school.edu.ng",
    status: TeacherStatus.ON_LEAVE,
  },
  {
    name: "Mr. David Amusan",
    subject: "Biology",
    className: "SSS 2",
    phoneNumber: "+234 823 312 7890",
    email: "david.i@school.edu.ng",
    status: TeacherStatus.ACTIVE,
  },
];

// From app/dashboard/students/[class]/data.ts — this roster belongs to JSS 1.
// `attendance` is the aggregate the old UI stored; the seed expands it into
// individual daily rows so the totals stay derivable.
const students = [
  { name: "Chioma Okafor", reg: "2024/001", gender: Gender.FEMALE, guardian: "Mr. Okafor", attendance: { present: 45, absent: 2, late: 3 } },
  { name: "Ahmed Ibrahim", reg: "2024/002", gender: Gender.MALE, guardian: "Mrs. Ibrahim", attendance: { present: 48, absent: 1, late: 1 } },
  { name: "Blessing Edet", reg: "2024/003", gender: Gender.FEMALE, guardian: "Mrs. Edet", attendance: { present: 47, absent: 0, late: 3 } },
  { name: "David Adebayo", reg: "2024/004", gender: Gender.MALE, guardian: "Mr. Adebayo", attendance: { present: 46, absent: 2, late: 2 } },
  { name: "Esther Okon", reg: "2024/005", gender: Gender.FEMALE, guardian: "Mr. Okon", attendance: { present: 49, absent: 0, late: 1 } },
  { name: "Femi Ojo", reg: "2024/006", gender: Gender.MALE, guardian: "Mrs. Ojo", attendance: { present: 44, absent: 3, late: 3 } },
  { name: "Gloria Okoye", reg: "2024/007", gender: Gender.FEMALE, guardian: "Mr. Okoye", attendance: { present: 47, absent: 1, late: 2 } },
  { name: "Habeeb Lawal", reg: "2024/008", gender: Gender.MALE, guardian: "Mrs. Lawal", attendance: { present: 48, absent: 0, late: 2 } },
  { name: "Ifeoma Nwafor", reg: "2024/009", gender: Gender.FEMALE, guardian: "Mr. Nwafor", attendance: { present: 46, absent: 2, late: 2 } },
  { name: "James Okoro", reg: "2024/010", gender: Gender.MALE, guardian: "Mrs. Okoro", attendance: { present: 49, absent: 0, late: 1 } },
  { name: "Kemi Adewale", reg: "2024/011", gender: Gender.FEMALE, guardian: "Mr. Adewale", attendance: { present: 45, absent: 3, late: 2 } },
  { name: "Kunle Adebayo", reg: "2024/012", gender: Gender.MALE, guardian: "Mrs. Adebayo", attendance: { present: 47, absent: 1, late: 2 } },
  { name: "Lola Adefemi", reg: "2024/013", gender: Gender.FEMALE, guardian: "Mr. Adefemi", attendance: { present: 48, absent: 0, late: 2 } },
  { name: "Mabel Akpan", reg: "2024/014", gender: Gender.FEMALE, guardian: "Mr. Akpan", attendance: { present: 46, absent: 2, late: 2 } },
];

// From app/dashboard/subjects/page.tsx
const subjects = [
  {
    name: "English Literature",
    department: "Humanities",
    level: SubjectLevel.SENIOR,
    colorClass: "bg-green-100",
    teacherEmail: null,
    className: "SSS 2",
    schedule: "Tue, Thu",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
  },
  {
    name: "Physics",
    department: "Sciences",
    level: SubjectLevel.SENIOR,
    colorClass: "bg-purple-100",
    teacherEmail: "musa.i@school.edu.ng",
    className: "SSS 1",
    schedule: "Mon, Wed, Fri",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
  },
  {
    name: "Bible Studies",
    department: "Religious Studies",
    level: SubjectLevel.ALL_LEVELS,
    colorClass: "bg-yellow-100",
    teacherEmail: null,
    className: "JSS 1",
    schedule: "Tue, Thu",
    startTime: "8:00 AM",
    endTime: "9:30 AM",
  },
];

// From app/dashboard/events/page.tsx
const events = [
  {
    title: "Annual Science Fair",
    description:
      "Showcase of student science projects from all grades with guest judges from local universities.",
    category: "Academic",
    colorClass: "bg-green-50 text-green-600",
    date: "2025-03-15",
    startTime: "09:00",
    endTime: "15:00",
    location: "School Main Hall",
    organizer: "Science Department",
    expectedAttendees: 320,
    status: EventStatus.UPCOMING,
  },
  {
    title: "Inter-School Basketball Tournament",
    description:
      "Regional basketball competition between 8 participating schools.",
    category: "Sports",
    colorClass: "bg-blue-50 text-blue-600",
    date: "2025-03-10",
    startTime: "14:00",
    endTime: "18:00",
    location: "Sports Complex",
    organizer: "Athletics Department",
    expectedAttendees: 450,
    status: EventStatus.UPCOMING,
  },
  {
    title: "Parent-Teacher Conference",
    description:
      "Quarterly meeting to discuss student progress and development.",
    category: "Meeting",
    colorClass: "bg-amber-50 text-amber-600",
    date: "2025-03-08",
    startTime: "16:30",
    endTime: "19:30",
    location: "Multiple Classrooms",
    organizer: "Administration",
    expectedAttendees: 280,
    status: EventStatus.UPCOMING,
  },
  {
    title: "Spring Cultural Festival",
    description:
      "Celebration of diverse cultures through performances, food, and exhibitions.",
    category: "Cultural",
    colorClass: "bg-purple-50 text-purple-600",
    date: "2025-04-05",
    startTime: "11:00",
    endTime: "17:00",
    location: "School Grounds",
    organizer: "Cultural Committee",
    expectedAttendees: 650,
    status: EventStatus.UPCOMING,
  },
  {
    title: "Professional Development Workshop",
    description:
      "Training session on modern teaching methodologies and classroom technologies.",
    category: "Meeting",
    colorClass: "bg-amber-50 text-amber-600",
    date: "2025-03-05",
    startTime: "09:00",
    endTime: "12:00",
    location: "Conference Room",
    organizer: "Staff Development Team",
    expectedAttendees: 45,
    status: EventStatus.ONGOING,
  },
];

// From app/dashboard/billings/page.tsx. Only JSS 1 and JSS 2 had a fee row
// there; the rest are interpolated from the payment amounts on the same page.
const termlyFees: Record<string, number> = {
  "JSS 1": 125_000,
  "JSS 2": 125_000,
  "JSS 3": 130_000,
  "SSS 1": 135_000,
  "SSS 2": 140_000,
  "SSS 3": 150_000,
};

const payments = [
  { reference: "PAY-001", studentName: "Adebayo Johnson", className: "SSS 3", amount: 150_000, status: PaymentStatus.PAID, date: "2024-01-05" },
  { reference: "PAY-002", studentName: "Chioma Ezekwesili", className: "JSS 1", amount: 125_000, status: PaymentStatus.PENDING, date: "2024-01-04" },
  { reference: "PAY-003", studentName: "Ibrahim Mohammed", className: "SSS 1", amount: 135_000, status: PaymentStatus.PAID, date: "2024-01-03" },
  { reference: "PAY-004", studentName: "Danfada Samuel", className: "SSS 3", amount: 135_000, status: PaymentStatus.PAID, date: "2024-01-03" },
  { reference: "PAY-005", studentName: "Mercy Akinleyer", className: "JSS 2", amount: 135_000, status: PaymentStatus.PAID, date: "2024-01-03" },
];

/** Walks backwards from `end`, skipping weekends, yielding `count` school days. */
function recentSchoolDays(count: number, end = new Date("2025-03-01")): Date[] {
  const days: Date[] = [];
  const cursor = new Date(end);

  while (days.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(cursor));
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return days.reverse();
}

/**
 * Whether to seed the sample roster (teachers, students, attendance, subjects,
 * events, billing).
 *
 * Off by default so a real school is not populated with fictional people. The
 * structural setup below — school, academic session/term, and the JSS 1–SSS 3
 * classes — is always seeded, because a school cannot be used without it.
 */
const SEED_DEMO_DATA = process.env.SCOOLR_SEED_DEMO_DATA === "true";

async function main() {
  console.log(
    `Seeding Scoolr (${SEED_DEMO_DATA ? "with" : "without"} demo data)…`
  );

  const school = await prisma.school.upsert({
    where: { slug: SCHOOL_SLUG },
    update: {},
    create: {
      name: SCHOOL_NAME,
      slug: SCHOOL_SLUG,
      address: "12 Awolowo Road, Ikoyi, Lagos",
      phone: "+234 800 000 0000",
      email: "hello@school.edu.ng",
    },
  });

  // No User rows are seeded: they are created on first sign-in from the Neon
  // Auth session (see `getCurrentUser` in lib/tenant.ts). A seeded row would
  // carry an `authUserId` that never matches a real session.

  // --- Academic calendar -------------------------------------------------
  const session = await prisma.academicSession.upsert({
    where: { schoolId_name: { schoolId: school.id, name: "2024/2025" } },
    update: {},
    create: {
      schoolId: school.id,
      name: "2024/2025",
      startDate: new Date("2024-09-09"),
      endDate: new Date("2025-07-25"),
      isCurrent: true,
    },
  });

  const term = await prisma.term.upsert({
    where: { sessionId_name: { sessionId: session.id, name: TermName.SECOND } },
    update: {},
    create: {
      sessionId: session.id,
      name: TermName.SECOND,
      startDate: new Date("2025-01-06"),
      endDate: new Date("2025-04-04"),
      isCurrent: true,
    },
  });

  // --- Classes -----------------------------------------------------------
  const classRoomsByName = new Map<string, string>();

  for (const cls of classes) {
    const classRoom = await prisma.classRoom.upsert({
      where: {
        schoolId_name_arm: { schoolId: school.id, name: cls.name, arm: "" },
      },
      update: {},
      create: { schoolId: school.id, name: cls.name, level: cls.level },
    });
    classRoomsByName.set(cls.name, classRoom.id);
  }

  if (!SEED_DEMO_DATA) {
    console.log(
      `Structure ready for "${SCHOOL_NAME}": ${classes.length} classes, session ${session.name}.\n` +
        "Set SCOOLR_SEED_DEMO_DATA=true to also seed the sample roster."
    );
    return;
  }

  // --- Teachers ----------------------------------------------------------
  const teachersByEmail = new Map<string, string>();

  for (const teacher of teachers) {
    const record = await prisma.teacher.upsert({
      where: {
        schoolId_email: { schoolId: school.id, email: teacher.email },
      },
      update: {},
      create: {
        schoolId: school.id,
        name: teacher.name,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        subject: teacher.subject,
        status: teacher.status,
        classRoomId: classRoomsByName.get(teacher.className),
      },
    });
    teachersByEmail.set(teacher.email, record.id);
  }

  // The form teachers named on the students dashboard are staff records in
  // their own right, created here so each class can point at one.
  for (const cls of classes) {
    const email = `${cls.formTeacher
      .replace(/^(Mrs\.|Mr\.|Dr\.|Miss)\s+/, "")
      .toLowerCase()}@school.edu.ng`;

    const formTeacher = await prisma.teacher.upsert({
      where: { schoolId_email: { schoolId: school.id, email } },
      update: {},
      create: {
        schoolId: school.id,
        name: cls.formTeacher,
        email,
        phoneNumber: "+234 800 000 0000",
        subject: "General Studies",
        status: TeacherStatus.ACTIVE,
        classRoomId: classRoomsByName.get(cls.name),
      },
    });

    await prisma.classRoom.update({
      where: { id: classRoomsByName.get(cls.name) },
      data: { formTeacherId: formTeacher.id },
    });
  }

  // --- Students & attendance ---------------------------------------------
  const jss1Id = classRoomsByName.get("JSS 1")!;
  const schoolDays = recentSchoolDays(50);

  for (const student of students) {
    const record = await prisma.student.upsert({
      where: {
        schoolId_registrationNumber: {
          schoolId: school.id,
          registrationNumber: student.reg,
        },
      },
      update: {},
      create: {
        schoolId: school.id,
        classRoomId: jss1Id,
        registrationNumber: student.reg,
        name: student.name,
        gender: student.gender,
      },
    });

    // Expand the stored aggregate into one row per school day.
    const { present, absent, late } = student.attendance;
    const statuses: AttendanceStatus[] = [
      ...Array<AttendanceStatus>(absent).fill(AttendanceStatus.ABSENT),
      ...Array<AttendanceStatus>(late).fill(AttendanceStatus.LATE),
      ...Array<AttendanceStatus>(present).fill(AttendanceStatus.PRESENT),
    ].slice(0, schoolDays.length);

    await prisma.attendance.createMany({
      data: statuses.map((status, index) => ({
        studentId: record.id,
        classRoomId: jss1Id,
        termId: term.id,
        date: schoolDays[index],
        status,
      })),
      skipDuplicates: true,
    });
  }

  // --- Subjects ----------------------------------------------------------
  for (const subject of subjects) {
    const record = await prisma.subject.upsert({
      where: { schoolId_name: { schoolId: school.id, name: subject.name } },
      update: {},
      create: {
        schoolId: school.id,
        name: subject.name,
        department: subject.department,
        level: subject.level,
        colorClass: subject.colorClass,
      },
    });

    const classRoomId = classRoomsByName.get(subject.className)!;

    await prisma.subjectAssignment.upsert({
      where: {
        subjectId_classRoomId_termId: {
          subjectId: record.id,
          classRoomId,
          termId: term.id,
        },
      },
      update: {},
      create: {
        subjectId: record.id,
        classRoomId,
        termId: term.id,
        teacherId: subject.teacherEmail
          ? teachersByEmail.get(subject.teacherEmail)
          : null,
        schedule: subject.schedule,
        startTime: subject.startTime,
        endTime: subject.endTime,
      },
    });
  }

  // --- Events ------------------------------------------------------------
  for (const event of events) {
    const existing = await prisma.event.findFirst({
      where: { schoolId: school.id, title: event.title },
    });

    if (existing) continue;

    await prisma.event.create({
      data: {
        schoolId: school.id,
        title: event.title,
        description: event.description,
        category: event.category,
        colorClass: event.colorClass,
        startsAt: new Date(`${event.date}T${event.startTime}:00.000Z`),
        endsAt: new Date(`${event.date}T${event.endTime}:00.000Z`),
        location: event.location,
        organizer: event.organizer,
        expectedAttendees: event.expectedAttendees,
        status: event.status,
      },
    });
  }

  // --- Fee structure ------------------------------------------------------
  for (const cls of classes) {
    const classRoomId = classRoomsByName.get(cls.name)!;

    await prisma.feeStructure.upsert({
      where: {
        classRoomId_termId_category: {
          classRoomId,
          termId: term.id,
          category: FeeCategory.SCHOOL_FEES,
        },
      },
      update: {},
      create: {
        schoolId: school.id,
        classRoomId,
        termId: term.id,
        category: FeeCategory.SCHOOL_FEES,
        amount: termlyFees[cls.name],
      },
    });
  }

  // --- Payments -----------------------------------------------------------
  // The billing page listed payments by student name only; each gets a student
  // record so the payment has something real to hang off.
  let nextReg = students.length + 1;

  for (const payment of payments) {
    let student = await prisma.student.findFirst({
      where: { schoolId: school.id, name: payment.studentName },
    });

    if (!student) {
      student = await prisma.student.create({
        data: {
          schoolId: school.id,
          classRoomId: classRoomsByName.get(payment.className),
          registrationNumber: `2024/${String(nextReg++).padStart(3, "0")}`,
          name: payment.studentName,
          gender: Gender.MALE,
        },
      });
    }

    const invoice = await prisma.invoice.upsert({
      where: { reference: `INV-${payment.reference.split("-")[1]}` },
      update: {},
      create: {
        schoolId: school.id,
        studentId: student.id,
        termId: term.id,
        reference: `INV-${payment.reference.split("-")[1]}`,
        amount: payment.amount,
        dueDate: new Date("2025-01-31"),
        status:
          payment.status === PaymentStatus.PAID
            ? InvoiceStatus.PAID
            : InvoiceStatus.PENDING,
      },
    });

    await prisma.payment.upsert({
      where: { reference: payment.reference },
      update: {},
      create: {
        schoolId: school.id,
        studentId: student.id,
        invoiceId: invoice.id,
        reference: payment.reference,
        amount: payment.amount,
        method: PaymentMethod.BANK_TRANSFER,
        status: payment.status,
        paidAt: new Date(payment.date),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
