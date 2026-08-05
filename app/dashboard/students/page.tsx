import { getClassRoomSummaries } from "@/lib/queries/students";

import { StudentsPageContent } from "./StudentsPageContent";

export default async function StudentsPage() {
  const classRooms = await getClassRoomSummaries();

  const totalStudents = classRooms.reduce(
    (sum, cls) => sum + cls.totalStudents,
    0
  );

  // Average only across classes that actually have attendance recorded, so a
  // class with no records doesn't drag the figure toward zero.
  const withAttendance = classRooms.filter(
    (cls) => cls.averageAttendance !== null
  );
  const averageAttendance =
    withAttendance.length > 0
      ? withAttendance.reduce(
          (sum, cls) => sum + (cls.averageAttendance ?? 0),
          0
        ) / withAttendance.length
      : null;

  return (
    <StudentsPageContent
      classRooms={classRooms}
      totalStudents={totalStudents}
      averageAttendance={averageAttendance}
    />
  );
}
