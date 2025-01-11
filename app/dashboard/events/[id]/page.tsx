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

export default function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/events">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{eventDetails.title}</h1>
          <p className="text-muted-foreground mt-1">
            Organised by {eventDetails.organizer}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex gap-2 mb-4">
                    <Badge>{eventDetails.status.toUpperCase()}</Badge>
                    <Badge variant="outline">{eventDetails.term}</Badge>
                    <Badge variant="outline">{eventDetails.class}</Badge>
                  </div>
                  <p className="text-lg">{eventDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(eventDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {eventDetails.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-sm text-muted-foreground">
                        {eventDetails.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Expected Attendance</p>
                      <p className="text-sm text-muted-foreground">
                        {eventDetails.attendees} people
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Programme of Events</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventDetails.programme.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Staff in Charge</h2>
            </CardHeader>
            <CardContent>
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

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Materials</h2>
            </CardHeader>
            <CardContent>
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
