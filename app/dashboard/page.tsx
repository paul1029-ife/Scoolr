import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  GraduationCap,
  Bell,
  Calendar,
  Trophy,
} from "lucide-react";

const Page = () => {
  const announcements = [
    { id: 1, title: "Parent-Teacher Conference", date: "March 15, 2025" },
    { id: 2, title: "Spring Break", date: "March 25-29, 2025" },
    { id: 3, title: "Senior Graduation Ceremony", date: "May 20, 2025" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Basketball Championship", date: "March 10, 2025" },
    { id: 2, title: "Science Fair", date: "March 18, 2025" },
    { id: 3, title: "Chapel Service", date: "March 20, 2025" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Triumphant Baptist College
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold">1,245</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <GraduationCap className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Graduation Rate</p>
              <h3 className="text-2xl font-bold">98.5%</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Trophy className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Academic Ranking</p>
              <h3 className="text-2xl font-bold">#5</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <CalendarDays className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <h3 className="text-2xl font-bold">95.2%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements and Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Important Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {announcement.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
