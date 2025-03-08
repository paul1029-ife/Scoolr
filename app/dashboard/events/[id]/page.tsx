"use client";
import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Download,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "../page";
import Link from "next/link";
import { useParams } from "next/navigation";
interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface EventDetails extends Event {
  description: string;
  programme: string[];
  staff: Staff[];
  materials: { name: string; url: string }[];
  class: string;
  term: string;
}

export default function EventDetailsPage() {
  const { id } = useParams();
  console.log(id);
  const eventDetails: EventDetails = {
    id: "1",
    title: "Inter-House Sports Competition 2025",
    type: "Sports",
    status: "upcoming",
    date: "2025-02-15",
    time: "8:00 AM - 4:00 PM",
    location: "School Sports Field",
    attendees: 500,
    organizer: "Sports Department",
    class: "All Classes",
    term: "Second Term",
    description:
      "Join us for our annual Inter-House Sports Competition featuring track and field events, football matches, and cultural displays. Parents and guardians are cordially invited to attend and support their children's houses.",
    programme: [
      "8:00 AM - Opening Prayer and National Anthem",
      "8:30 AM - March Past Competition",
      "9:30 AM - Track Events Begin (100m, 200m, 400m)",
      "11:00 AM - Field Events (High Jump, Long Jump)",
      "12:30 PM - Lunch Break",
      "1:30 PM - Relay Races",
      "2:30 PM - Cultural Displays",
      "3:30 PM - Prize Presentation",
      "4:00 PM - Closing Ceremony",
    ],
    staff: [
      {
        id: "1",
        name: "Mr. Ogunlade",
        role: "Sports Master",
        avatar: "/api/placeholder/32/32",
      },
      {
        id: "2",
        name: "Mrs. Adebayo",
        role: "House Mistress (Blue House)",
        avatar: "/api/placeholder/32/32",
      },
      {
        id: "3",
        name: "Mr. Nnamdi",
        role: "House Master (Red House)",
        avatar: "/api/placeholder/32/32",
      },
    ],
    materials: [
      { name: "Competition Schedule", url: "#" },
      { name: "Sports Field Layout", url: "#" },
      { name: "Parent Invitation Letter", url: "#" },
    ],
  };

  return (
    <div className="container mx-auto space-y-8 max-w-7xl">
      {/* Header Section */}
      <div className="border-b px-4 border-gray-200 bg-white rounded-t-md flex sticky top-0 py-3 items-center justify-between z-10">
        <div className="flex justify-center items-center gap-2">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-md text-gray-800 font-medium tracking-tight">
            {eventDetails.title}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600">
            <Edit className="h-4 w-4" />
            Edit Event
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-4">
                    <Badge>{eventDetails.status}</Badge>
                    <Badge variant="outline">{eventDetails.term}</Badge>
                    <Badge variant="outline">{eventDetails.class}</Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {eventDetails.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(eventDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{eventDetails.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{eventDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Expected Attendance
                      </p>
                      <p className="font-medium">
                        {eventDetails.attendees} people
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-gray-100">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl">Programme of Events</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {eventDetails.programme.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-gray-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          <Card className="hover:shadow-md transition-shadow border-gray-100">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl">Staff in Charge</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {eventDetails.staff.map((person) => (
                  <div key={person.id} className="flex items-center gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {person.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-gray-100">
            <CardHeader className="border-b pb-3">
              <h2 className="text-xl">Materials</h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                {eventDetails.materials.map((material, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {material.name}
                    <Download className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
