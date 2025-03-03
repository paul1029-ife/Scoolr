"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import Link from "next/link";

// Event types with consistent color scheme
const eventTypes = [
  { name: "Sports", color: "bg-blue-50 text-blue-600" },
  { name: "Academic", color: "bg-green-50 text-green-600" },
  { name: "Cultural", color: "bg-purple-50 text-purple-600" },
  { name: "Meeting", color: "bg-amber-50 text-amber-600" },
  { name: "Holiday", color: "bg-rose-50 text-rose-600" },
];

// Mock events data
const mockEvents = [
  {
    id: "EVT-001",
    title: "Annual Science Fair",
    description:
      "Showcase of student science projects from all grades with guest judges from local universities.",
    type: "Academic",
    date: "2025-03-15",
    time: "9:00 AM - 3:00 PM",
    location: "School Main Hall",
    organizer: "Science Department",
    attendees: 320,
    status: "upcoming" as const,
  },
  {
    id: "EVT-002",
    title: "Inter-School Basketball Tournament",
    description:
      "Regional basketball competition between 8 participating schools.",
    type: "Sports",
    date: "2025-03-10",
    time: "2:00 PM - 6:00 PM",
    location: "Sports Complex",
    organizer: "Athletics Department",
    attendees: 450,
    status: "upcoming" as const,
  },
  {
    id: "EVT-003",
    title: "Parent-Teacher Conference",
    description:
      "Quarterly meeting to discuss student progress and development.",
    type: "Meeting",
    date: "2025-03-08",
    time: "4:30 PM - 7:30 PM",
    location: "Multiple Classrooms",
    organizer: "Administration",
    attendees: 280,
    status: "upcoming" as const,
  },
  {
    id: "EVT-004",
    title: "Spring Cultural Festival",
    description:
      "Celebration of diverse cultures through performances, food, and exhibitions.",
    type: "Cultural",
    date: "2025-04-05",
    time: "11:00 AM - 5:00 PM",
    location: "School Grounds",
    organizer: "Cultural Committee",
    attendees: 650,
    status: "upcoming" as const,
  },
  {
    id: "EVT-005",
    title: "Professional Development Workshop",
    description:
      "Training session on modern teaching methodologies and classroom technologies.",
    type: "Meeting",
    date: "2025-03-05",
    time: "9:00 AM - 12:00 PM",
    location: "Conference Room",
    organizer: "Staff Development Team",
    attendees: 45,
    status: "ongoing" as const,
  },
];

export interface Event {
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

interface AddEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: Event) => void;
  eventTypes: { name: string; color: string }[];
}

// Event Modal Component
const AddEventModal = React.memo(
  ({ isOpen, onOpenChange, onSubmit, eventTypes }: AddEventModalProps) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      type: "",
      date: "",
      time: "",
      location: "",
      organizer: "",
      attendees: "",
    });

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      },
      []
    );

    const handleSelectChange = useCallback((field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }, []);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: Event = {
          id: `EVT-${String(Date.now()).slice(-3)}`,
          ...formData,
          attendees: parseInt(formData.attendees) || 0,
          status: "upcoming" as const,
        };

        onSubmit(newEvent);

        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "",
          date: "",
          time: "",
          location: "",
          organizer: "",
          attendees: "",
        });
      },
      [formData, onSubmit]
    );

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.name} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="Enter organizer"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 9:00 AM - 4:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="attendees">Expected Attendees</Label>
                  <Input
                    id="attendees"
                    name="attendees"
                    type="number"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    placeholder="Enter number of attendees"
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

AddEventModal.displayName = "AddEventModal";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents); // Initialized with mock data

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
    return eventType?.color || "bg-gray-50 text-gray-600";
  };

  const handleEventSubmit = useCallback((newEvent: Event) => {
    setEvents((prev) => [newEvent, ...prev]);
    setIsAddEventModalOpen(false);
  }, []);

  return (
    <div className="mx-auto space-y-6">
      <div className="border-b px-4 py-3 border-gray-200 bg-white rounded-t-md flex sticky top-0 items-center justify-between z-10">
        <h1 className="text-md tracking-tight text-gray-700">
          Events Management
        </h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddEventModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add New Event
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-blue-50 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Upcoming Events
                </p>
                <p className="text-2xl">{upcomingEvents.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-green-50 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Ongoing Events
                </p>
                <p className="text-2xl">{ongoingEvents.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gray-100">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="p-3 bg-purple-50 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-md font-medium text-muted-foreground">
                  Total Participants
                </p>
                <p className="text-2xl">
                  {events.reduce((sum, event) => sum + event.attendees, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
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
                {eventTypes.map((type) => (
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
                    No events found matching your criteria
                  </p>
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
                          className={`${getEventTypeColor(event.type)} ml-2`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(event.date).toLocaleDateString("en-US", {
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
                            {event.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {event.attendees.toLocaleString()} Attendees
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-md font-medium text-muted-foreground">
                          Organized by {event.organizer}
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
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {event.time.split(" - ")[0]}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Quick add button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-dashed border-gray-200 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsAddEventModalOpen(true)}
                  >
                    <PlusCircle className="h-3 w-3 mr-2" />
                    Quick Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Event Modal */}
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onOpenChange={setIsAddEventModalOpen}
          onSubmit={handleEventSubmit}
          eventTypes={eventTypes}
        />
      </div>
    </div>
  );
}
