import { getSubjectFormOptions, getSubjects } from "@/lib/queries/subjects";

import { SubjectsPageContent } from "./SubjectsPageContent";

export default async function SubjectsPage() {
  const [subjects, { teachers, classRooms }] = await Promise.all([
    getSubjects(),
    getSubjectFormOptions(),
  ]);

  return (
    <SubjectsPageContent
      subjects={subjects}
      teachers={teachers}
      classRooms={classRooms}
    />
  );
}
