"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ensurePermission, getCurrentSchoolId } from "@/lib/tenant";
import {
  eventFormSchema,
  eventTypeColor,
  type EventFormData,
} from "@/types/event";

const EVENTS_PATH = "/dashboard/events";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Parses "9:00 AM" / "14:30" into minutes past midnight, or null. */
function parseClockTime(value: string): number | null {
  const match = value
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3]?.toLowerCase();

  if (minutes > 59) return null;

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  if (hours > 23) return null;

  return hours * 60 + minutes;
}

/**
 * Turns "2025-03-15" + "9:00 AM - 4:00 PM" into a start and end instant.
 * Times are treated as UTC so a date never shifts across a day boundary
 * depending on where the server happens to run.
 */
function toInstants(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [startRaw, endRaw] = time.split(/\s*[-–]\s*/);

  const startMinutes = parseClockTime(startRaw ?? "");
  if (startMinutes === null) return null;

  const startsAt = new Date(
    Date.UTC(year, month - 1, day, Math.floor(startMinutes / 60), startMinutes % 60)
  );

  let endsAt: Date | null = null;
  if (endRaw) {
    const endMinutes = parseClockTime(endRaw);
    if (endMinutes === null) return null;

    endsAt = new Date(
      Date.UTC(year, month - 1, day, Math.floor(endMinutes / 60), endMinutes % 60)
    );

    // An end before the start means the event runs past midnight.
    if (endsAt <= startsAt) {
      endsAt = new Date(endsAt.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  return { startsAt, endsAt };
}

export async function createEvent(
  data: EventFormData
): Promise<ActionResult> {
  const permitted = await ensurePermission("event:manage");
  if (!permitted.ok) return permitted;

  const parsed = eventFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid event details",
    };
  }

  const instants = toInstants(parsed.data.date, parsed.data.time);

  if (!instants) {
    return {
      ok: false,
      error: 'Could not read that time. Use a format like "9:00 AM - 4:00 PM".',
    };
  }

  const schoolId = await getCurrentSchoolId();

  await prisma.event.create({
    data: {
      schoolId,
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      colorClass: eventTypeColor(parsed.data.category),
      organizer: parsed.data.organizer,
      location: parsed.data.location,
      expectedAttendees: parsed.data.expectedAttendees,
      startsAt: instants.startsAt,
      endsAt: instants.endsAt,
      // Status is derived from the dates on read; the column only records an
      // explicit cancellation.
    },
  });

  revalidatePath(EVENTS_PATH);
  return { ok: true };
}

export async function removeEvent(id: string): Promise<ActionResult> {
  const permitted = await ensurePermission("event:manage");
  if (!permitted.ok) return permitted;

  const schoolId = await getCurrentSchoolId();

  const { count } = await prisma.event.deleteMany({ where: { id, schoolId } });

  if (count === 0) {
    return { ok: false, error: "That event no longer exists." };
  }

  revalidatePath(EVENTS_PATH);
  return { ok: true };
}
