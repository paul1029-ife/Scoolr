import { getEvents } from "@/lib/queries/events";

import { EventsPageContent } from "./EventsPageContent";

export default async function EventsPage() {
  const events = await getEvents();

  return <EventsPageContent events={events} />;
}
