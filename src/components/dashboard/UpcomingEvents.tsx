import { useState } from "react";
import { Calendar, Gift, Users, Briefcase, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  type: "birthday" | "meeting" | "onboarding" | "review";
  title: string;
  time: string;
  people?: string;
}

const initialEvents: Event[] = [
  {
    id: "1",
    type: "meeting",
    title: "Quarterly Review Meeting",
    time: "10:00 AM",
    people: "All Managers",
  },
  {
    id: "2",
    type: "birthday",
    title: "Emma Wilson's Birthday",
    time: "Today",
  },
  {
    id: "3",
    type: "onboarding",
    title: "New Hire Orientation",
    time: "2:00 PM",
    people: "3 new employees",
  },
  {
    id: "4",
    type: "review",
    title: "Performance Review",
    time: "4:30 PM",
    people: "David Kim",
  },
];

const typeConfig = {
  birthday: { icon: Gift, color: "bg-warning/10 text-warning" },
  meeting: { icon: Users, color: "bg-primary/10 text-primary" },
  onboarding: { icon: Briefcase, color: "bg-success/10 text-success" },
  review: { icon: Calendar, color: "bg-accent/20 text-accent" },
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "meeting" as Event["type"],
    people: "",
  });

  const handleEventClick = (event: Event) => {
    toast.info(`Opening: ${event.title}`);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      time: newEvent.time,
      type: newEvent.type,
      people: newEvent.people || undefined,
    };
    setEvents([...events, event]);
    toast.success("Event added successfully!");
    setAddEventOpen(false);
    setNewEvent({ title: "", time: "", type: "meeting", people: "" });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
          <DialogTrigger asChild>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new event for the calendar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Event Title *</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Team meeting"
                />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Input
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="2:00 PM"
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input
                  value={newEvent.people}
                  onChange={(e) => setNewEvent({ ...newEvent, people: e.target.value })}
                  placeholder="All team members"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setAddEventOpen(false)}>Cancel</Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors animate-slide-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("p-2 rounded-lg shrink-0", config.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.time}
                  {event.people && ` · ${event.people}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
