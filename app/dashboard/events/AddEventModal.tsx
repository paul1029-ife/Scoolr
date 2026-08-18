"use client";

import React, { useCallback, useState } from "react";
import { FormDrawer, DrawerForm } from "@/components/common/form-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { createEvent } from "@/lib/actions/events";
import { runAction } from "@/lib/actions/run-action";
import { EVENT_TYPES } from "@/types/event";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  date: "",
  time: "",
  location: "",
  organizer: "",
  expectedAttendees: "",
};

interface AddEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddEventModal = React.memo(
  ({ isOpen, onOpenChange }: AddEventModalProps) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      },
      []
    );

    const handleSelectChange = useCallback((field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setIsSaving(true);
      const result = await runAction(() =>
        createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        organizer: formData.organizer,
        date: formData.date,
        time: formData.time,
        location: formData.location,
          expectedAttendees: Number(formData.expectedAttendees) || 0,
        })
      );
      setIsSaving(false);

      if (!result.ok) {
        // Keep the dialog open so the entered details aren't lost.
        toast({
          title: "Could not create event",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Event created",
        description: `“${formData.title}” has been added to the calendar.`,
      });

      setFormData(EMPTY_FORM);
      onOpenChange(false);
    };

    return (
      <FormDrawer
        open={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Event"
        description="Schedule an event on the school calendar."
        width="lg"
      >
        <DrawerForm
          onSubmit={handleSubmit}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Creating..." : "Create Event"}
              </Button>
            </>
          }
        >
          <div className="grid gap-5">
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
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {EVENT_TYPES.map((type) => (
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
                  <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                  <Input
                    id="expectedAttendees"
                    name="expectedAttendees"
                    type="number"
                    min={0}
                    value={formData.expectedAttendees}
                    onChange={handleInputChange}
                    placeholder="Enter number of attendees"
                    required
                  />
                </div>
              </div>
            </div>

        </DrawerForm>
      </FormDrawer>
    );
  }
);

AddEventModal.displayName = "AddEventModal";

export default AddEventModal;
