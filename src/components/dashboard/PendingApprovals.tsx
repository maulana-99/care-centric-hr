import { useState } from "react";
import { Check, X, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  status: "pending" | "approved" | "rejected";
}

const initialApprovals: ApprovalItem[] = [
  {
    id: "1",
    employee: { name: "Michael Chen", avatar: "MC", department: "Engineering" },
    type: "leave",
    title: "Annual Leave Request",
    details: "Dec 27 - Jan 3 (8 days)",
    date: "2 hours ago",
    urgent: true,
    status: "pending",
  },
  {
    id: "2",
    employee: { name: "Emma Wilson", avatar: "EW", department: "Marketing" },
    type: "reimbursement",
    title: "Travel Expense",
    details: "$1,245.00 - Client Visit",
    date: "5 hours ago",
    status: "pending",
  },
  {
    id: "3",
    employee: { name: "James Rodriguez", avatar: "JR", department: "Sales" },
    type: "leave",
    title: "Sick Leave",
    details: "Dec 26 (1 day)",
    date: "Yesterday",
    status: "pending",
  },
  {
    id: "4",
    employee: { name: "Sophie Taylor", avatar: "ST", department: "Design" },
    type: "document",
    title: "Contract Amendment",
    details: "Remote work agreement",
    date: "Yesterday",
    status: "pending",
  },
];

const typeConfig = {
  leave: { icon: Calendar, color: "text-primary bg-primary/10" },
  reimbursement: { icon: DollarSign, color: "text-warning bg-warning/10" },
  document: { icon: FileText, color: "text-secondary-foreground bg-secondary" },
};

export function PendingApprovals() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleApprove = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const approval = approvals.find(a => a.id === id);
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: "approved" as const } : a
    ));
    toast.success(`Approved ${approval?.employee.name}'s ${approval?.title.toLowerCase()}`);
    setDetailsOpen(false);
  };

  const handleReject = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const approval = approvals.find(a => a.id === id);
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: "rejected" as const } : a
    ));
    toast.error(`Rejected ${approval?.employee.name}'s ${approval?.title.toLowerCase()}`);
    setDetailsOpen(false);
  };

  const openDetails = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setDetailsOpen(true);
  };

  const pendingCount = approvals.filter(a => a.status === "pending").length;

  return (
    <>
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
            <p className="text-sm text-muted-foreground">{pendingCount} requests awaiting your review</p>
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
                onClick={() => openDetails(item)}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all animate-fade-in group cursor-pointer",
                  item.urgent && item.status === "pending" && "border-l-2 border-l-warning",
                  item.status !== "pending" && "opacity-60"
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
                    {item.status !== "pending" && (
                      <Badge variant={item.status === "approved" ? "default" : "destructive"} className="text-xs">
                        {item.status}
                      </Badge>
                    )}
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
                {item.status === "pending" && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleApprove(item.id, e)}
                      className="p-2 rounded-lg hover:bg-success/20 text-success transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleReject(item.id, e)}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Review the details of this request before making a decision.
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {selectedApproval.employee.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedApproval.employee.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedApproval.employee.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Request Type</p>
                  <p className="font-medium capitalize">{selectedApproval.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Details</p>
                  <p className="font-medium">{selectedApproval.details}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium">{selectedApproval.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge 
                    variant={
                      selectedApproval.status === "approved" 
                        ? "default" 
                        : selectedApproval.status === "rejected" 
                          ? "destructive" 
                          : "secondary"
                    }
                  >
                    {selectedApproval.status}
                  </Badge>
                </div>
              </div>

              {selectedApproval.status === "pending" && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleReject(selectedApproval.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-success hover:bg-success/90"
                    onClick={() => handleApprove(selectedApproval.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
