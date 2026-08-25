import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBody, PageHeader } from "@/components/common/page-header";
import {
  Calendar,
  Clock,
  Download,
  Edit,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getEventById } from "@/lib/queries/events";
import { eventStatusLabel } from "@/types/event";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // This page previously rendered one hardcoded event regardless of the id.
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={event.title}
        backHref="/dashboard/events"
        backLabel="Back to events"
        actions={
          <>
            <Button variant="outline">
              <Share2 />
              <span className="max-sm:sr-only">Share</span>
            </Button>
            <Button variant="outline">
              <Edit />
              Edit event
            </Button>
          </>
        }
      />

      <PageBody className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column (2/3 width on large screens) */}
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-4">
                    <Badge>{eventStatusLabel[event.status]}</Badge>
                    {event.termName && (
                      <Badge variant="outline">{event.termName}</Badge>
                    )}
                    <Badge variant="outline">
                      {event.className ?? "All Classes"}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {event.description ?? "No description added yet."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          timeZone: "UTC",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Clock className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <MapPin className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{event.location ?? "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Users className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Attendance
                      </p>
                      <p className="font-medium">
                        {event.expectedAttendees} people
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Programme of Events</h2>
            </CardHeader>
            <CardContent className="p-6">
              {event.programme.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No programme added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {event.programme.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-muted p-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Staff in Charge</h2>
            </CardHeader>
            <CardContent className="p-6">
              {event.staff.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No staff assigned yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {event.staff.map((person) => (
                    <div key={person.id} className="flex items-center gap-3">
                      {/* Initials rather than a placeholder image request. */}
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                        {person.name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase() ?? "")
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium">{person.name}</p>
                        {person.role && (
                          <p className="text-sm text-muted-foreground">
                            {person.role}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b pb-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Materials</h2>
            </CardHeader>
            <CardContent className="p-6">
              {event.materials.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No materials attached.
                </p>
              ) : (
                <div className="space-y-2">
                  {event.materials.map((material) => (
                    <Button
                      key={material.id}
                      variant="outline"
                      className="w-full justify-between"
                      asChild={Boolean(material.url)}
                    >
                      {material.url ? (
                        <a href={material.url} download>
                          {material.name}
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <>
                          {material.name}
                          <Download className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
