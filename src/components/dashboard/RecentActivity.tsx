import { UserPlus, UserMinus, Award, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "hire" | "departure" | "promotion" | "clock" | "approval";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "hire",
    title: "New Employee Joined",
    description: "Alex Thompson joined the Engineering team",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "approval",
    title: "Leave Approved",
    description: "You approved Sarah's vacation request",
    time: "3 hours ago",
  },
  {
    id: "3",
    type: "promotion",
    title: "Promotion Processed",
    description: "Lisa Park promoted to Senior Designer",
    time: "Yesterday",
  },
  {
    id: "4",
    type: "departure",
    title: "Employee Offboarding",
    description: "Tom Baker's last day is Dec 31",
    time: "Yesterday",
  },
  {
    id: "5",
    type: "clock",
    title: "Late Clock-in Alert",
    description: "5 employees clocked in late today",
    time: "Today",
  },
];

const typeConfig = {
  hire: { icon: UserPlus, color: "bg-success/10 text-success border-success/20" },
  departure: { icon: UserMinus, color: "bg-destructive/10 text-destructive border-destructive/20" },
  promotion: { icon: Award, color: "bg-warning/10 text-warning border-warning/20" },
  clock: { icon: Clock, color: "bg-muted text-muted-foreground border-muted" },
  approval: { icon: FileCheck, color: "bg-primary/10 text-primary border-primary/20" },
};

export function RecentActivity() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex gap-4 animate-fade-in relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border relative z-10",
                  config.color
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
