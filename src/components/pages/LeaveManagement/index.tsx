import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, Plus, CalendarDays, ChevronRight,
  MoreVertical, Download, Timer, Plane, Heart, Baby,
  BookOpen, Umbrella, ChevronLeft
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types ---
type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
type LeaveType = "annual" | "sick" | "maternity" | "study" | "unpaid" | "vacation";

interface LeaveRequest {
  id: number;
  employee_name: string;
  employee_role: string;
  employee_avatar: string;
  type: LeaveType;
  status: LeaveStatus;
  start_date: string;
  end_date: string;
  duration: number;
  reason: string;
  applied_at: string;
}

// --- Mock Data ---
const MOCK_REQUESTS: LeaveRequest[] = [
  { id: 1, employee_name: "John Doe", employee_role: "Senior Developer", employee_avatar: "https://i.pravatar.cc/150?u=2", type: "annual", status: "pending", start_date: "2026-03-10", end_date: "2026-03-15", duration: 5, reason: "Family trip to Bali", applied_at: "2026-02-18" },
  { id: 2, employee_name: "Emily Wilson", employee_role: "UI/UX Designer", employee_avatar: "https://i.pravatar.cc/150?u=3", type: "sick", status: "approved", start_date: "2026-02-20", end_date: "2026-02-21", duration: 1, reason: "High fever and flu", applied_at: "2026-02-19" },
  { id: 3, employee_name: "Michael Brown", employee_role: "Product Designer", employee_avatar: "https://i.pravatar.cc/150?u=4", type: "annual", status: "pending", start_date: "2026-04-05", end_date: "2026-04-10", duration: 5, reason: "Attending friend's wedding", applied_at: "2026-02-15" },
  { id: 4, employee_name: "Jessica Lee", employee_role: "Product Manager", employee_avatar: "https://i.pravatar.cc/150?u=5", type: "maternity", status: "approved", start_date: "2026-03-01", end_date: "2026-06-01", duration: 90, reason: "Maternity leave", applied_at: "2026-01-20" },
  { id: 5, employee_name: "David Miller", employee_role: "Backend Engineer", employee_avatar: "https://i.pravatar.cc/150?u=6", type: "study", status: "rejected", start_date: "2026-02-25", end_date: "2026-02-28", duration: 3, reason: "Workshop for cloud certification", applied_at: "2026-02-10" },
  { id: 6, employee_name: "Sarah Anderson", employee_role: "HR Manager", employee_avatar: "https://i.pravatar.cc/150?u=1", type: "vacation", status: "pending", start_date: "2026-05-12", end_date: "2026-05-20", duration: 8, reason: "Summer vacation", applied_at: "2026-02-19" },
  { id: 7, employee_name: "Daniel Martinez", employee_role: "DevOps Engineer", employee_avatar: "https://i.pravatar.cc/150?u=10", type: "unpaid", status: "cancelled", start_date: "2026-02-15", end_date: "2026-02-16", duration: 1, reason: "Personal business", applied_at: "2026-02-12" },
];

const LEAVE_TYPE_CONFIG: Record<LeaveType, { label: string; icon: any; color: string; bg: string }> = {
  annual: { label: "Annual Leave", icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  sick: { label: "Sick Leave", icon: Heart, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  maternity: { label: "Maternity", icon: Baby, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  study: { label: "Study Leave", icon: BookOpen, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  unpaid: { label: "Unpaid Leave", icon: Clock, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
  vacation: { label: "Vacation", icon: Umbrella, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
};

const STATUS_CONFIG: Record<LeaveStatus, { label: string; icon: any; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Timer, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  cancelled: { label: "Cancelled", icon: AlertCircle, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
};

// --- Stat Card ---
function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="relative overflow-hidden border hover:shadow-lg transition-shadow group">
        <CardContent className="p-5 flex items-center gap-4">
          <div className={cn("p-3 rounded-2xl", color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
            {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
          </div>
        </CardContent>
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", color.replace("/10", "/5"))} />
      </Card>
    </motion.div>
  );
}

export function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    let list = [...MOCK_REQUESTS];
    if (activeTab !== "all") list = list.filter(r => r.status === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.employee_name.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q));
    }
    return list;
  }, [activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const stats = useMemo(() => ({
    total: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter(r => r.status === "pending").length,
    approved: MOCK_REQUESTS.filter(r => r.status === "approved").length,
    onLeave: 4, // Mock
  }), []);

  const handleAction = (id: number, action: string) => {
    toast.success(`Request ${action} successfully`, {
      description: `Leave request #${id} has been marked as ${action}.`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Leave Management</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Track, review, and manage employee leave requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Exporting data...")}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> New Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Requests" value={stats.pending} icon={Timer} color="bg-amber-500/10 text-amber-600" sub="Waiting for review" />
        <StatCard label="Approved (Month)" value={stats.approved} icon={CheckCircle2} color="bg-emerald-500/10 text-emerald-600" sub="Monthly approved" />
        <StatCard label="Currently on Leave" value={stats.onLeave} icon={Plane} color="bg-blue-500/10 text-blue-600" sub="Active leave today" />
        <StatCard label="Total Applications" value={stats.total} icon={CalendarDays} color="bg-primary/10 text-primary" sub="All time requests" />
      </div>

      {/* Filters Card */}
      <Card className="border rounded-2xl overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-11 border">
              <TabsTrigger value="all" className="rounded-lg px-4 data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-lg px-4 data-[state=active]:shadow-sm">
                Pending <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-700">{stats.pending}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg px-4 data-[state=active]:shadow-sm">Approved</TabsTrigger>
              <TabsTrigger value="rejected" className="rounded-lg px-4 data-[state=active]:shadow-sm">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl focus-visible:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="border rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Leave Requests</CardTitle>
            <CardDescription>Review and manage all employee time-off applications</CardDescription>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 mr-2">
              <span className="hidden sm:block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rows:</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[60px] h-8 text-xs bg-muted/40 border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1 px-1">
                {(() => {
                  const pages = [];
                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                      if (pages.length > 0 && pages[pages.length - 1] !== i - 1 && pages[pages.length - 1] !== "...") {
                        pages.push("...");
                      }
                      pages.push(i);
                    }
                  }
                  return pages.map((p, idx) => (
                    typeof p === "number" ? (
                      <Button
                        key={idx}
                        variant={currentPage === p ? "default" : "ghost"}
                        size="icon"
                        className={cn(
                          "h-7 w-7 text-[11px] font-bold rounded-lg transition-all",
                          currentPage === p ? "gradient-primary border-0 text-white shadow-md scale-105" : "hover:bg-background/80"
                        )}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </Button>
                    ) : (
                      <span key={idx} className="text-[10px] text-muted-foreground font-bold px-1 select-none">...</span>
                    )
                  ));
                })()}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/10 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right pr-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-muted/50 rounded-full">
                            <CalendarDays className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-muted-foreground font-medium">No leave requests found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((req, i) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group hover:bg-muted/20 transition-all cursor-pointer"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border shadow-sm">
                              <AvatarImage src={req.employee_avatar} />
                              <AvatarFallback>{req.employee_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold group-hover:text-primary transition-colors">{req.employee_name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-semibold">{req.employee_role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <LeaveTypeBadge type={req.type} />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <p className="text-[13px] font-medium">{new Date(req.start_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })} — {new Date(req.end_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <p className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">"{req.reason}"</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-mono font-bold">
                          {req.duration} Days
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="px-6 py-5 text-right pr-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {req.status === "pending" ? (
                              <>
                                <Button size="sm" variant="outline" className="h-8 rounded-lg border-emerald-500/20 text-emerald-600 hover:bg-emerald-50" onClick={(e) => { e.stopPropagation(); handleAction(req.id, "approved"); }}>Approve</Button>
                                <Button size="sm" variant="outline" className="h-8 rounded-lg border-rose-500/20 text-rose-600 hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); handleAction(req.id, "rejected"); }}>Reject</Button>
                              </>
                            ) : (
                              <Button size="sm" variant="ghost" className="h-8 rounded-lg">View Details</Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md"><MoreVertical className="w-4 h-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem className="rounded-lg">Request Changes</DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-rose-600">Cancel Request</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaveTypeBadge({ type }: { type: LeaveType }) {
  const config = LEAVE_TYPE_CONFIG[type];
  const Icon = config.icon;
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold", config.bg, config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize", config.bg, config.color)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
}

