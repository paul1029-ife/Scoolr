import { z } from "zod";

import { EventStatus } from "@/lib/generated/prisma/enums";

export { EventStatus };

/** Event types with the colour scheme the events board already uses. */
export const EVENT_TYPES = [
  { name: "Sports", color: "bg-blue-50 text-blue-600" },
  { name: "Academic", color: "bg-green-50 text-green-600" },
  { name: "Cultural", color: "bg-purple-50 text-purple-600" },
  { name: "Meeting", color: "bg-amber-50 text-amber-600" },
  { name: "Holiday", color: "bg-rose-50 text-rose-600" },
] as const;

export function eventTypeColor(category: string): string {
  return (
    EVENT_TYPES.find((type) => type.name === category)?.color ??
    "bg-gray-50 text-gray-600"
  );
}

export const eventFormSchema = z.object({
  title: z.string().trim().min(2, "Event title is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Event type is required"),
  organizer: z.string().trim().min(1, "Organizer is required"),
  /** yyyy-mm-dd from the date input. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
  /** Free text, e.g. "9:00 AM - 4:00 PM". */
  time: z.string().trim().min(1, "Time is required"),
  location: z.string().trim().min(1, "Location is required"),
  expectedAttendees: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Enter a whole number")
    .min(0, "Cannot be negative")
    .max(1_000_000, "That looks too large"),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export type EventListItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  /** ISO date string; formatted in the client so the server stays timezone-neutral. */
  date: string;
  time: string;
  location: string | null;
  organizer: string | null;
  expectedAttendees: number;
  status: EventStatus;
};

export type EventDetail = EventListItem & {
  programme: string[];
  staff: { id: string; name: string; role: string | null; avatarUrl: string | null }[];
  materials: { id: string; name: string; url: string | null }[];
  className: string | null;
  termName: string | null;
};

export const eventStatusLabel: Record<EventStatus, string> = {
  [EventStatus.UPCOMING]: "Upcoming",
  [EventStatus.ONGOING]: "Ongoing",
  [EventStatus.COMPLETED]: "Completed",
  [EventStatus.CANCELLED]: "Cancelled",
};
