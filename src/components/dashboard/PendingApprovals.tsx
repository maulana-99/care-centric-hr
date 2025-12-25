import { Check, X, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApprovalItem {
  id: string;
  employee: {
    name: string;
    avatar: string;
    department: string;
  };
  type: "leave" | "reimbursement" | "document";
  title: string;
  details: string;
  date: string;
  urgent?: boolean;
}

const approvals: ApprovalItem[] = [
  {
    id: "1",
    employee: { name: "Michael Chen", avatar: "MC", department: "Engineering" },
    type: "leave",
    title: "Annual Leave Request",
    details: "Dec 27 - Jan 3 (8 days)",
    date: "2 hours ago",
    urgent: true,
  },
  {
    id: "2",
    employee: { name: "Emma Wilson", avatar: "EW", department: "Marketing" },
    type: "reimbursement",
    title: "Travel Expense",
    details: "$1,245.00 - Client Visit",
    date: "5 hours ago",
  },
  {
    id: "3",
    employee: { name: "James Rodriguez", avatar: "JR", department: "Sales" },
    type: "leave",
    title: "Sick Leave",
    details: "Dec 26 (1 day)",
    date: "Yesterday",
  },
  {
    id: "4",
    employee: { name: "Sophie Taylor", avatar: "ST", department: "Design" },
    type: "document",
    title: "Contract Amendment",
    details: "Remote work agreement",
    date: "Yesterday",
  },
];

const typeConfig = {
  leave: { icon: Calendar, color: "text-primary bg-primary/10" },
  reimbursement: { icon: DollarSign, color: "text-warning bg-warning/10" },
  document: { icon: FileText, color: "text-secondary-foreground bg-secondary" },
};

export function PendingApprovals() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
          <p className="text-sm text-muted-foreground">12 requests awaiting your review</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {approvals.map((item, index) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all animate-fade-in group",
                item.urgent && "border-l-2 border-l-warning"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-foreground">
                  {item.employee.avatar}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-foreground text-sm">
                    {item.employee.name}
                  </span>
                  <div className={cn("p-1 rounded-md", config.color)}>
                    <Icon className="w-3 h-3" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {item.title} · {item.details}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                {item.date}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-success/20 text-success transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
