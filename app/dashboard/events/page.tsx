"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Search,
  PlusCircle,
  MapPin,
  Users,
  CalendarDays,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed";
}

// Sample data
const events: Event[] = [
  {
    id: "EVT-001",
    title: "Inter-House Sports Competition",
    description:
      "Annual inter-house sports competition featuring track and field events",
    type: "Sports",
    date: "2024-02-15",
    time: "9:00 AM - 4:00 PM",
    location: "School Sports Complex",
    organizer: "Sports Department",
    attendees: 850,
    status: "upcoming",
  },
  {
    id: "EVT-002",
    title: "Science Fair 2024",
    description: "Exhibition of student science projects and innovations",
    type: "Academic",
    date: "2024-02-20",
    time: "10:00 AM - 2:00 PM",
    location: "School Hall",
    organizer: "Science Department",
    attendees: 400,
    status: "upcoming",
  },
  {
    id: "EVT-003",
    title: "Parent-Teacher Meeting",
    description: "First term parent-teacher conference",
    type: "Meeting",
    date: "2024-01-25",
    time: "2:00 PM - 5:00 PM",
    location: "Classrooms",
    organizer: "School Administration",
    attendees: 600,
    status: "upcoming",
  },
  // Add more events...
];

const eventTypes = [
  { name: "Sports", color: "bg-blue-100 text-blue-700" },
  { name: "Academic", color: "bg-green-100 text-green-700" },
  { name: "Cultural", color: "bg-purple-100 text-purple-700" },
  { name: "Meeting", color: "bg-yellow-100 text-yellow-700" },
  { name: "Holiday", color: "bg-red-100 text-red-700" },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const ongoingEvents = events.filter((event) => event.status === "ongoing");

  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === "all" || event.type === selectedType)
  );

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find((t) => t.name === type);
    return eventType?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events & Activities</h1>
          <p className="text-muted-foreground mt-1">
            Manage school events and activities
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ongoing Events</p>
              <p className="text-2xl font-bold">{ongoingEvents.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Participants
              </p>
              <p className="text-2xl font-bold">
                {events.reduce((sum, event) => sum + event.attendees, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Events</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.name} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Organized by {event.organizer}
                    </span>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader className="border-b">
              <h2 className="text-xl font-semibold">Calendar</h2>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Upcoming Events</h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} •{" "}
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
