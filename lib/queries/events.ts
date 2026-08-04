import "server-only";

import { prisma } from "@/lib/prisma";
import { getCurrentSchoolId } from "@/lib/tenant";
import { EventStatus, type EventDetail, type EventListItem } from "@/types/event";

const listSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  startsAt: true,
  endsAt: true,
  location: true,
  organizer: true,
  expectedAttendees: true,
  status: true,
} as const;

/** Rebuilds the "9:00 AM - 4:00 PM" label the cards display. */
function formatTime(startsAt: Date, endsAt: Date | null): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  const start = startsAt.toLocaleTimeString("en-US", options);
  if (!endsAt) return start;

  return `${start} - ${endsAt.toLocaleTimeString("en-US", options)}`;
}

/**
 * Upcoming/ongoing/completed follow from the clock, so they are derived on read
 * rather than stored — otherwise every event stays "upcoming" forever unless a
 * background job rewrites it. Only CANCELLED is an explicit, sticky state.
 */
function deriveStatus(
  startsAt: Date,
  endsAt: Date | null,
  stored: EventStatus
): EventStatus {
  if (stored === EventStatus.CANCELLED) return EventStatus.CANCELLED;

  const now = Date.now();
  const finishesAt = (endsAt ?? startsAt).getTime();

  if (now < startsAt.getTime()) return EventStatus.UPCOMING;
  if (now > finishesAt) return EventStatus.COMPLETED;
  return EventStatus.ONGOING;
}

function toListItem(event: {
  id: string;
  title: string;
  description: string | null;
  category: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string | null;
  organizer: string | null;
  expectedAttendees: number | null;
  status: EventStatus;
}): EventListItem {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.startsAt.toISOString(),
    time: formatTime(event.startsAt, event.endsAt),
    location: event.location,
    organizer: event.organizer,
    expectedAttendees: event.expectedAttendees ?? 0,
    status: deriveStatus(event.startsAt, event.endsAt, event.status),
  };
}

export async function getEvents(): Promise<EventListItem[]> {
  const schoolId = await getCurrentSchoolId();

  const events = await prisma.event.findMany({
    where: { schoolId },
    select: listSelect,
    orderBy: { startsAt: "asc" },
  });

  return events.map(toListItem);
}

export async function getEventById(id: string): Promise<EventDetail | null> {
  const schoolId = await getCurrentSchoolId();

  const event = await prisma.event.findFirst({
    where: { id, schoolId },
    select: {
      ...listSelect,
      programme: true,
      classRoom: { select: { name: true, arm: true } },
      term: { select: { name: true, session: { select: { name: true } } } },
      attendees: {
        select: { id: true, name: true, role: true, avatarUrl: true },
        orderBy: { createdAt: "asc" },
      },
      materials: {
        select: { id: true, name: true, url: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) return null;

  return {
    ...toListItem(event),
    programme: event.programme,
    staff: event.attendees,
    materials: event.materials,
    className: event.classRoom
      ? [event.classRoom.name, event.classRoom.arm].filter(Boolean).join(" ")
      : null,
    termName: event.term
      ? `${event.term.name.charAt(0)}${event.term.name
          .slice(1)
          .toLowerCase()} term`
      : null,
  };
}
