import { getGuardians, getLinkableStudents } from "@/lib/queries/guardians";

import { GuardiansPageContent } from "./GuardiansPageContent";

export default async function GuardiansPage() {
  const [guardians, students] = await Promise.all([
    getGuardians(),
    getLinkableStudents(),
  ]);

  return <GuardiansPageContent guardians={guardians} students={students} />;
}
