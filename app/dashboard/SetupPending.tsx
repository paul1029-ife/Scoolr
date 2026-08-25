import { Wrench } from "lucide-react";

import { FullPageNotice } from "@/components/common/page-header";

/**
 * Shown to staff who cannot run the wizard while their school is still being
 * set up. Without classes and a term, every dashboard page would be empty.
 */
export function SetupPending() {
  return (
    <FullPageNotice
      icon={Wrench}
      title="Your school is still being set up"
      description="An administrator needs to finish adding the academic session, terms and classes before the dashboard can be used. You'll have access as soon as that's done."
    />
  );
}

export default SetupPending;
