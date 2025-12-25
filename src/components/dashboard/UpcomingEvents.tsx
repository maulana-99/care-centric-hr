import { Calendar, Gift, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  type: "birthday" | "meeting" | "onboarding" | "review";
  title: string;
  time: string;
  people?: string;
}

const events: Event[] = [
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
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
          <p className="text-sm text-muted-foreground">December 25, 2024</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          View Calendar
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;

          return (
            <div
              key={event.id}
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
