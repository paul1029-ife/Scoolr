import { notFound } from "next/navigation";

import {
  getClassRoomBySlug,
  getStudentsForClassRoom,
} from "@/lib/queries/students";

import { ClassPageContent } from "./ClassPageContent";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ class: string }>;
}) {
  const { class: slug } = await params;

  const classRoom = await getClassRoomBySlug(slug);

  // Previously the class name was parsed straight out of the URL, so any slug
  // rendered a page. Now an unknown class is a genuine 404.
  if (!classRoom) {
    notFound();
  }

  const students = await getStudentsForClassRoom(classRoom.id);

  return (
    <ClassPageContent
      classRoomId={classRoom.id}
      className={classRoom.displayName}
      students={students}
    />
  );
}
