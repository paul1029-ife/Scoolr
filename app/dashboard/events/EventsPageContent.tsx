"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  PlusCircle,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Calendar,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import SimpleCard from "@/components/common/simple-card";

import { AddEventModal } from "./AddEventModal";
import { useCan } from "@/components/auth/permissions-provider";
import {
  EVENT_TYPES,
  EventStatus,
  eventTypeColor,
  type EventListItem,
} from "@/types/event";

/** Dates are formatted here, in the browser's locale, not on the server. */
function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
}

export function EventsPageContent({ events }: { events: EventListItem[] }) {
  const canManage = useCan("event:manage");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const upcomingEvents = events.filter(
    (event) => event.status === EventStatus.UPCOMING
  );
  const ongoingEvents = events.filter(
    (event) => event.status === EventStatus.ONGOING
  );

  const query = searchTerm.toLowerCase();
  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)) &&
      (selectedType === "all" || event.category === selectedType)
  );

  return (
    <div className="mx-auto space-y-6">
      <div className="border-b px-4 py-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 items-center justify-between z-10">
        <h1 className="text-md tracking-tight text-gray-700">
          Events Management
        </h1>
        {canManage && (
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddEventModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Event
          </Button>
        )}
      </div>

      <div className="px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SimpleCard
            title="Upcoming Events"
            value={`${upcomingEvents.length}`}
          />
          <SimpleCard title="Ongoing Events" value={`${ongoingEvents.length}`} />
          <SimpleCard
            title="Total Participants"
            value={`${events.reduce(
              (sum, event) => sum + event.expectedAttendees,
              0
            )}`}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-5 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Events</SelectItem>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Event Cards */}
          <div className="lg:col-span-2 space-y-5">
            {filteredEvents.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    {events.length === 0
                      ? "No events yet. Use “Add New Event” to create one."
                      : "No events found matching your criteria"}
                  </p>
                  {events.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedType("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-md transition-shadow border-gray-100"
                >
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-lg text-gray-800">
                            {event.title}
                          </h3>
                          <p className="text-md font-medium text-muted-foreground mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                        <Badge
                          className={`${eventTypeColor(event.category)} ml-2`}
                        >
                          {event.category}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(event.date, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {event.location ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {event.expectedAttendees.toLocaleString()} Attendees
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-md font-medium text-muted-foreground">
                          Organized by {event.organizer ?? "—"}
                        </span>
                        <Link href={`/dashboard/events/${event.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="border-gray-100 sticky top-20">
              <CardHeader className="border-b border-gray-100 py-4 px-5">
                <h2 className="text-gray-700">Calendar</h2>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-gray-600">Upcoming Events</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                    >
                      View All
                    </Button>
                  </div>

                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Nothing scheduled yet.
                    </p>
                  )}

                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-gray-700 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(event.date, {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {event.time.split(" - ")[0]}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Quick add button */}
                  {canManage && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-dashed border-gray-200 text-gray-500 hover:text-gray-700"
                      onClick={() => setIsAddEventModalOpen(true)}
                    >
                      <PlusCircle className="h-3 w-3 mr-2" />
                      Quick Add Event
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Event Modal */}
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onOpenChange={setIsAddEventModalOpen}
        />
      </div>
    </div>
  );
}

export default EventsPageContent;
