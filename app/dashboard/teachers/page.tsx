import { TeachersProvider } from "@/context/teachers-context";
import { getClassRoomOptions, getTeachers } from "@/lib/queries/teachers";

import { TeachersPageContent } from "./TeachersPageContent";

// Staff records change constantly, so this must never be prerendered at build
// time or cached between requests.
export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const [teachers, classRooms] = await Promise.all([
    getTeachers(),
    getClassRoomOptions(),
  ]);

  return (
    <TeachersProvider teachers={teachers} classRooms={classRooms}>
      <TeachersPageContent />
    </TeachersProvider>
  );
}
