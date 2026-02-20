import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Filter, Clock, MapPin, Camera, ChevronLeft, ChevronRight,
  CheckCircle2, AlertTriangle, XCircle, Timer, TrendingUp, Users,
  MoreVertical, Eye, Edit, CalendarDays, ArrowUpDown, Download,
  SunMedium, Moon, Coffee, LogIn, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label as RechartsLabel,
  LabelList,
  RadialBar,
  RadialBarChart,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- Types ---
type AttendanceStatus = "present" | "late" | "early_leave" | "absent" | "half_day" | "holiday" | "weekend";

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_role: string;
  employee_avatar: string;
  date: string;
  shift_name: string;
  branch_name: string;
  clock_in: string | null;
  clock_in_address: string | null;
  clock_in_selfie_path: string | null;
  clock_in_notes: string | null;
  clock_out: string | null;
  clock_out_address: string | null;
  clock_out_selfie_path: string | null;
  clock_out_notes: string | null;
  status: AttendanceStatus;
  scheduled_start: string;
  scheduled_end: string;
  late_minutes: number;
  early_leave_minutes: number;
  work_duration_minutes: number;
  overtime_minutes: number;
  is_manual_entry: boolean;
  corrected_by: string | null;
  correction_reason: string | null;
}

// --- Mock Data ---
const TODAY = "2026-02-18";
function getLastWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() - 2);
  else if (day === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}
const DEFAULT_DATE = getLastWeekday(TODAY);
const STATUSES: AttendanceStatus[] = ["present", "late", "early_leave", "absent", "half_day"];
const SHIFTS = ["Morning Shift", "Afternoon Shift", "Night Shift"];
const BRANCHES = ["HQ Jakarta", "Bandung Branch", "Surabaya Branch"];
const ADDRESSES = ["Jl. Sudirman No. 123, Jakarta", "Jl. Asia Afrika No. 45, Bandung", "Jl. Pemuda No. 78, Surabaya", "Jl. Gatot Subroto No. 12, Jakarta"];

function fmtTime(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function generateRecords(): AttendanceRecord[] {
  const names = [
    "Sarah Anderson", "John Doe", "Emily Wilson", "Michael Brown", "Jessica Lee",
    "David Miller", "Sophia Taylor", "James Wilson", "Olivia Davis", "Daniel Martinez",
    "Isabella Garcia", "William Rodriguez", "Mia Hernandez", "Alexander Lopez", "Charlotte Gonzalez",
    "Benjamin Perez", "Amelia Sanchez", "Ethan Rivera", "Harper Campbell", "Lucas Mitchell",
  ];
  const roles = [
    "HR Manager", "Developer", "Designer", "Product Manager", "Support",
    "Security", "QA Engineer", "Frontend Dev", "Backend Dev", "DevOps",
    "Product Owner", "Scrum Master", "UX Researcher", "Data Analyst", "Marketing",
    "Sales", "Customer Success", "Account Manager", "Content Writer", "SEO Specialist",
  ];
  const records: AttendanceRecord[] = [];
  const today = new Date(TODAY);

  for (let d = 0; d < 35; d++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - d);
    const dateStr = targetDate.toISOString().split("T")[0];

    const dayOfWeek = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    names.forEach((name, i) => {
      const isLastWeekday = dateStr === getLastWeekday(TODAY);
      const isToday = dateStr === TODAY;
      const status = STATUSES[Math.floor(Math.random() * (isToday ? 4 : 5))];
      const shift = SHIFTS[i % 3];
      const branch = BRANCHES[i % 3];
      const schedStart = shift === "Morning Shift" ? "06:00" : shift === "Afternoon Shift" ? "14:00" : "22:00";
      const schedEnd = shift === "Morning Shift" ? "14:00" : shift === "Afternoon Shift" ? "22:00" : "06:00";
      const lateMins = status === "late" ? Math.floor(Math.random() * 45) + 5 : 0;
      const earlyMins = status === "early_leave" ? Math.floor(Math.random() * 30) + 10 : 0;
      const clockInH = shift === "Morning Shift" ? 6 : shift === "Afternoon Shift" ? 14 : 22;

      // On the latest weekday, simulate some employees not clocked in/out yet
      const notClockedIn = isLastWeekday && status !== "absent" && (i % 7 === 3 || i % 7 === 5);
      const notClockedOut = isLastWeekday && status !== "absent" && !notClockedIn && (i % 5 === 1 || i % 5 === 4);

      const hasClockIn = status !== "absent" && !notClockedIn;
      const hasClockOut = hasClockIn && !notClockedOut && !(isToday && status !== "early_leave");

      const workDur = !hasClockIn ? 0 : !hasClockOut ? 0 : status === "half_day" ? 240 : (480 - lateMins - earlyMins);
      const overtime = hasClockOut && status === "present" && Math.random() > 0.7 ? Math.floor(Math.random() * 60) + 15 : 0;

      records.push({
        id: (35 - d) * 100 + i,
        employee_id: i + 1,
        employee_name: name,
        employee_role: roles[i],
        employee_avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
        date: dateStr,
        shift_name: shift,
        branch_name: branch,
        clock_in: hasClockIn ? `${dateStr}T${fmtTime(clockInH + (lateMins > 0 ? Math.floor(lateMins / 60) : 0), lateMins % 60)}:00+07:00` : null,
        clock_in_address: hasClockIn ? ADDRESSES[i % 4] : null,
        clock_in_selfie_path: hasClockIn ? `/selfies/${i}_in.jpg` : null,
        clock_in_notes: lateMins > 15 ? "Traffic jam on the way" : null,
        clock_out: hasClockOut ? `${dateStr}T${fmtTime((clockInH + 8 - Math.floor(earlyMins / 60)) % 24, (60 - earlyMins % 60) % 60)}:00+07:00` : null,
        clock_out_address: hasClockOut ? ADDRESSES[i % 4] : null,
        clock_out_selfie_path: hasClockOut ? `/selfies/${i}_out.jpg` : null,
        clock_out_notes: earlyMins > 0 ? "Family emergency" : null,
        status,
        scheduled_start: schedStart,
        scheduled_end: schedEnd,
        late_minutes: lateMins,
        early_leave_minutes: earlyMins,
        work_duration_minutes: workDur,
        overtime_minutes: overtime,
        is_manual_entry: Math.random() > 0.9,
        corrected_by: null,
        correction_reason: null,
      });
    });
  }
  return records;
}

const ALL_RECORDS = generateRecords();

// --- Status Config ---
const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  present: { label: "Present", color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2, bg: "bg-emerald-500/10 border-emerald-500/20" },
  late: { label: "Late", color: "text-amber-600 dark:text-amber-400", icon: AlertTriangle, bg: "bg-amber-500/10 border-amber-500/20" },
  early_leave: { label: "Early Leave", color: "text-orange-600 dark:text-orange-400", icon: Timer, bg: "bg-orange-500/10 border-orange-500/20" },
  absent: { label: "Absent", color: "text-red-600 dark:text-red-400", icon: XCircle, bg: "bg-red-500/10 border-red-500/20" },
  half_day: { label: "Half Day", color: "text-sky-600 dark:text-sky-400", icon: Coffee, bg: "bg-sky-500/10 border-sky-500/20" },
  holiday: { label: "Holiday", color: "text-violet-600 dark:text-violet-400", icon: CalendarDays, bg: "bg-violet-500/10 border-violet-500/20" },
  weekend: { label: "Weekend", color: "text-slate-500 dark:text-slate-400", icon: Moon, bg: "bg-slate-500/10 border-slate-500/20" },
};

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const c = STATUS_CONFIG[status];
  const Icon = c.icon;
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-semibold text-[11px] px-2.5 py-1 rounded-full border", c.bg, c.color)}>
      <Icon className="w-3 h-3" /> {c.label}
    </Badge>
  );
}

function formatDuration(mins: number) {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function extractTime(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  return fmtTime(d.getHours(), d.getMinutes());
}

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

// --- Attendance Donut Chart ---
function AttendanceRadialCard({ percentage }: { percentage: number }) {
  const chartData = [
    { name: "present", value: percentage, fill: "var(--color-present)" },
    { name: "absent", value: 100 - percentage, fill: "var(--color-absent)" },
  ];

  const chartConfig = {
    percentage: {
      label: "Attendance",
    },
    present: {
      label: "Present",
      color: "hsl(var(--primary))",
    },
    absent: {
      label: "Absent",
      color: "hsl(var(--muted))",
    },
  } satisfies ChartConfig;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full">
      <Card className="flex flex-col border hover:shadow-lg transition-shadow overflow-hidden h-full">
        <CardHeader className="items-center pb-0 p-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attendance Rate</CardTitle>
          <CardDescription className="text-[10px]">Overall daily engagement</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 p-0 flex flex-col justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[160px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={75}
                strokeWidth={5}
                paddingAngle={2}
                cornerRadius={4}
              >
                <RechartsLabel
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {percentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-[10px] font-medium"
                          >
                            Present Today
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Status Distribution Bar Chart ---
function StatusDistributionCard({ stats, className }: { stats: { present: number; late: number; absent: number; earlyLeave: number; halfDay: number }; className?: string }) {
  const chartData = [
    { status: "Present", count: stats.present, fill: "var(--color-present)" },
    { status: "Late", count: stats.late, fill: "var(--color-late)" },
    { status: "Absent", count: stats.absent, fill: "var(--color-absent)" },
    { status: "Early", count: stats.earlyLeave, fill: "var(--color-early)" },
    { status: "Half", count: stats.halfDay, fill: "var(--color-half)" },
  ];

  const chartConfig = {
    count: { label: "Count" },
    present: { label: "Present", color: "hsl(var(--success, 142 76% 36%))" },
    late: { label: "Late", color: "hsl(var(--warning, 38 92% 50%))" },
    absent: { label: "Absent", color: "hsl(var(--destructive, 0 84% 60%))" },
    early: { label: "Early Leave", color: "hsl(var(--orange, 24 95% 53%))" },
    half: { label: "Half Day", color: "hsl(var(--info, 199 89% 48%))" },
  } satisfies ChartConfig;

  // Manual mapping using Shadcn-like professional palette
  const colors = {
    present: "hsl(var(--primary))",
    late: "hsl(24.6 95% 53.1%)",
    absent: "hsl(0 84.2% 60.2%)",
    early: "hsl(199 89% 48%)",
    half: "hsl(262.1 83.3% 57.8%)",
  };

  const themedData = chartData.map(d => ({
    ...d,
    fill: colors[d.status.toLowerCase() as keyof typeof colors] || colors.present
  }));

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={cn("h-full", className)}>
      <Card className="border hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status Breakdown</CardTitle>
          <CardDescription className="text-[10px]">Headcount by attendance status</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-2 pt-0 flex flex-col justify-end">
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <BarChart accessibilityLayer data={themedData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="status" tickLine={false} tickMargin={8} axisLine={false} tick={{ fontSize: 10, fontWeight: 500 }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" radius={4} barSize={36}>
                <LabelList dataKey="count" position="top" offset={10} className="fill-foreground font-bold text-[11px]" />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Attendance Trend Area Chart ---
function AttendanceTrendCard({ data, range, onRangeChange }: { data: { date: string; rate: number }[], range: 7 | 30, onRangeChange: (r: 7 | 30) => void }) {
  const chartConfig = {
    rate: {
      label: "Attendance Rate",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
      <Card className="border hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attendance Trend</CardTitle>
            <CardDescription className="text-[10px]">Percentage over last {range} days (Swipe to view)</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={String(range)} onValueChange={(v) => onRangeChange(Number(v) as 7 | 30)}>
              <TabsList className="h-7 p-0.5 bg-muted/50">
                <TabsTrigger value="7" className="text-[10px] px-2 h-6">7D</TabsTrigger>
                <TabsTrigger value="30" className="text-[10px] px-2 h-6">30D</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">
              <TrendingUp className="w-3 h-3" /> +2.4%
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="overflow-x-auto pb-4 custom-scrollbar scroll-smooth">
            <div style={{ minWidth: range === 30 ? "800px" : "100%", height: "140px" }} className="px-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    minTickGap={range === 30 ? 30 : 10}
                    tickFormatter={(value) => {
                      const d = new Date(value);
                      return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                    }}
                    tick={{ fontSize: 10, fontWeight: 500 }}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Area
                    dataKey="rate"
                    type="monotone"
                    fill="url(#fillRate)"
                    fillOpacity={0.4}
                    stroke="var(--color-rate)"
                    strokeWidth={2.5}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.4);
        }
      `}</style>
    </motion.div>
  );
}

// --- Detail Modal ---
function DetailModal({ record, open, onClose }: { record: AttendanceRecord | null; open: boolean; onClose: () => void }) {
  if (!record) return null;
  const sc = STATUS_CONFIG[record.status];
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarImage src={record.employee_avatar} />
              <AvatarFallback>{record.employee_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <span className="block">{record.employee_name}</span>
              <span className="text-xs text-muted-foreground font-normal">{record.employee_role}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-3 pt-1">
            <CalendarDays className="w-4 h-4" /> {record.date}
            <span className="text-muted-foreground">•</span>
            <StatusBadge status={record.status} />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Schedule & Shift */}
          <div className="grid grid-cols-3 gap-3">
            <InfoBlock label="Shift" value={record.shift_name} icon={<SunMedium className="w-3.5 h-3.5" />} />
            <InfoBlock label="Branch" value={record.branch_name} icon={<MapPin className="w-3.5 h-3.5" />} />
            <InfoBlock label="Schedule" value={`${record.scheduled_start} – ${record.scheduled_end}`} icon={<Clock className="w-3.5 h-3.5" />} />
          </div>

          {/* Clock In/Out */}
          <div className="grid grid-cols-2 gap-4">
            <ClockBlock title="Clock In" time={extractTime(record.clock_in)} address={record.clock_in_address} notes={record.clock_in_notes} selfiePath={record.clock_in_selfie_path} color="emerald" />
            <ClockBlock title="Clock Out" time={extractTime(record.clock_out)} address={record.clock_out_address} notes={record.clock_out_notes} selfiePath={record.clock_out_selfie_path} color="rose" />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <MetricPill label="Late" value={formatDuration(record.late_minutes)} warn={record.late_minutes > 0} />
            <MetricPill label="Early Leave" value={formatDuration(record.early_leave_minutes)} warn={record.early_leave_minutes > 0} />
            <MetricPill label="Work Duration" value={formatDuration(record.work_duration_minutes)} />
            <MetricPill label="Overtime" value={formatDuration(record.overtime_minutes)} good={record.overtime_minutes > 0} />
          </div>

          {/* Flags */}
          {(record.is_manual_entry || record.correction_reason) && (
            <div className="flex gap-2 flex-wrap">
              {record.is_manual_entry && <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200">Manual Entry</Badge>}
              {record.correction_reason && <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200">Corrected: {record.correction_reason}</Badge>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-muted/40 rounded-xl p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">{icon}{label}</div>
      <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

function ClockBlock({ title, time, address, notes, selfiePath, color }: { title: string; time: string; address: string | null; notes: string | null; selfiePath: string | null; color: string }) {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <div className={cn("rounded-2xl border p-4 space-y-3", `border-${color}-200/50 dark:border-${color}-500/20`)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
          {selfiePath && <Camera className={cn("w-4 h-4", `text-${color}-500`)} />}
        </div>

        {selfiePath && (
          <div
            className="relative aspect-video rounded-xl overflow-hidden border bg-muted group/img cursor-pointer"
            onClick={() => setShowFull(true)}
          >
            <img
              src={selfiePath}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover/img:scale-110"
              onError={(e) => {
                // If mock image fails, show a placeholder with better UI
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=300&fit=crop`;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/30">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}

        <p className="text-2xl font-bold font-mono text-foreground">{time}</p>
        {address && <p className="text-[11px] text-muted-foreground flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" />{address}</p>}
        {notes && <p className="text-[11px] text-muted-foreground italic bg-muted/50 rounded-lg px-2 py-1">"{notes}"</p>}
      </div>

      <Dialog open={showFull} onOpenChange={setShowFull}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[90vw] md:max-w-xl">
          <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={selfiePath || ""}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&h=600&fit=crop`;
              }}
            />
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <p className="text-white font-bold text-lg">{title} Photo</p>
              <p className="text-white/70 text-sm font-mono">{time}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetricPill({ label, value, warn, good }: { label: string; value: string; warn?: boolean; good?: boolean }) {
  return (
    <div className={cn("rounded-xl p-3 text-center border", warn ? "bg-amber-500/5 border-amber-500/20" : good ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/30 border-transparent")}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-lg font-bold font-mono mt-0.5", warn ? "text-amber-600 dark:text-amber-400" : good ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{value}</p>
    </div>
  );
}

// --- Correction Dialog ---
function CorrectionDialog({
  record,
  open,
  onClose,
  onSave,
}: {
  record: AttendanceRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: AttendanceRecord) => void;
}) {
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("present");
  const [reason, setReason] = useState("");

  // Sync form when record changes
  const resetForm = useCallback(() => {
    if (!record) return;
    setClockIn(record.clock_in ? extractTime(record.clock_in) : "");
    setClockOut(record.clock_out ? extractTime(record.clock_out) : "");
    setStatus(record.status);
    setReason("");
  }, [record]);

  // Reset on open
  useMemo(() => { if (open) resetForm(); }, [open, resetForm]);

  if (!record) return null;

  const handleSave = () => {
    if (!reason.trim()) {
      toast.error("Correction reason is required");
      return;
    }

    // Build corrected clock_in timestamp
    const buildTimestamp = (timeStr: string) => {
      if (!timeStr) return null;
      return `${record.date}T${timeStr}:00+07:00`;
    };

    const newClockIn = buildTimestamp(clockIn);
    const newClockOut = buildTimestamp(clockOut);

    // Calculate late minutes
    let lateMins = 0;
    if (newClockIn && record.scheduled_start) {
      const [sh, sm] = record.scheduled_start.split(":").map(Number);
      const [ch, cm] = clockIn.split(":").map(Number);
      const diff = (ch * 60 + cm) - (sh * 60 + sm);
      lateMins = diff > 0 ? diff : 0;
    }

    // Calculate early leave
    let earlyLeaveMins = 0;
    if (newClockOut && record.scheduled_end) {
      const [sh, sm] = record.scheduled_end.split(":").map(Number);
      const [ch, cm] = clockOut.split(":").map(Number);
      const diff = (sh * 60 + sm) - (ch * 60 + cm);
      earlyLeaveMins = diff > 0 ? diff : 0;
    }

    // Calculate work duration
    let workDuration = 0;
    if (newClockIn && newClockOut) {
      const [ih, im] = clockIn.split(":").map(Number);
      const [oh, om] = clockOut.split(":").map(Number);
      workDuration = ((oh * 60 + om) - (ih * 60 + im));
      if (workDuration < 0) workDuration += 24 * 60; // overnight shift
    }

    // Calculate overtime
    let overtime = 0;
    if (newClockOut && record.scheduled_end) {
      const [sh, sm] = record.scheduled_end.split(":").map(Number);
      const [ch, cm] = clockOut.split(":").map(Number);
      const diff = (ch * 60 + cm) - (sh * 60 + sm);
      overtime = diff > 0 ? diff : 0;
    }

    const updated: AttendanceRecord = {
      ...record,
      clock_in: newClockIn,
      clock_out: newClockOut,
      status,
      late_minutes: lateMins,
      early_leave_minutes: earlyLeaveMins,
      work_duration_minutes: workDuration,
      overtime_minutes: overtime,
      corrected_by: "Sarah Anderson",
      correction_reason: reason.trim(),
      is_manual_entry: true,
    };

    onSave(updated);
    onClose();
    toast.success("Attendance corrected successfully", {
      description: `${record.employee_name} — ${reason.trim()}`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Edit className="w-5 h-5 text-amber-600" />
            </div>
            Correct Attendance Entry
          </DialogTitle>
          <DialogDescription>
            Correcting record for <strong>{record.employee_name}</strong> on {record.date}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Current Info */}
          <div className="bg-muted/40 rounded-xl p-3 flex items-center gap-3">
            <Avatar className="w-9 h-9 ring-2 ring-background">
              <AvatarImage src={record.employee_avatar} />
              <AvatarFallback>{record.employee_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{record.employee_name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{record.employee_role} • {record.shift_name} • {record.scheduled_start}–{record.scheduled_end}</p>
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    <span className="flex items-center gap-2">
                      <v.icon className={cn("w-3.5 h-3.5", v.color)} />
                      {v.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clock In/Out */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="correct-clock-in">Clock In</Label>
              <Input
                id="correct-clock-in"
                type="time"
                value={clockIn}
                onChange={e => setClockIn(e.target.value)}
                className="font-mono"
              />
              <p className="text-[10px] text-muted-foreground">Scheduled: {record.scheduled_start}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correct-clock-out">Clock Out</Label>
              <Input
                id="correct-clock-out"
                type="time"
                value={clockOut}
                onChange={e => setClockOut(e.target.value)}
                className="font-mono"
              />
              <p className="text-[10px] text-muted-foreground">Scheduled: {record.scheduled_end}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="grid gap-2">
            <Label htmlFor="correction-reason">Correction Reason *</Label>
            <Textarea
              id="correction-reason"
              placeholder="e.g. Employee forgot to clock in, verified by supervisor..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <p className="text-[10px] text-muted-foreground">This will be logged for audit purposes</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Save Correction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Clock Action Dialog (Admin Clock In / Clock Out) ---
function ClockActionDialog({
  record,
  action,
  open,
  onClose,
  onSave,
}: {
  record: AttendanceRecord | null;
  action: "clock_in" | "clock_out";
  open: boolean;
  onClose: () => void;
  onSave: (updated: AttendanceRecord) => void;
}) {
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = useCallback(() => {
    if (!record) return;
    // Default to scheduled time
    setTime(action === "clock_in" ? record.scheduled_start : record.scheduled_end);
    setNotes("");
  }, [record, action]);

  useMemo(() => { if (open) resetForm(); }, [open, resetForm]);

  if (!record) return null;

  const isClockIn = action === "clock_in";
  const title = isClockIn ? "Clock In Karyawan" : "Clock Out Karyawan";
  const Icon = isClockIn ? LogIn : LogOut;
  const iconColor = isClockIn ? "text-emerald-600" : "text-sky-600";
  const iconBg = isClockIn ? "bg-emerald-500/10" : "bg-sky-500/10";

  const handleSave = () => {
    if (!time) { toast.error("Waktu harus diisi"); return; }
    const timestamp = `${record.date}T${time}:00+07:00`;

    let lateMins = record.late_minutes;
    let workDur = record.work_duration_minutes;
    let earlyMins = record.early_leave_minutes;
    let overtime = record.overtime_minutes;

    if (isClockIn) {
      // Calculate late
      const [sh, sm] = record.scheduled_start.split(":").map(Number);
      const [ch, cm] = time.split(":").map(Number);
      const diff = (ch * 60 + cm) - (sh * 60 + sm);
      lateMins = diff > 0 ? diff : 0;
    } else {
      // Calculate work duration & early leave & overtime
      const clockInTime = extractTime(record.clock_in);
      if (clockInTime !== "—") {
        const [ih, im] = clockInTime.split(":").map(Number);
        const [oh, om] = time.split(":").map(Number);
        workDur = (oh * 60 + om) - (ih * 60 + im);
        if (workDur < 0) workDur += 24 * 60;
      }
      const [sh, sm] = record.scheduled_end.split(":").map(Number);
      const [ch, cm] = time.split(":").map(Number);
      const earlyDiff = (sh * 60 + sm) - (ch * 60 + cm);
      earlyMins = earlyDiff > 0 ? earlyDiff : 0;
      const otDiff = (ch * 60 + cm) - (sh * 60 + sm);
      overtime = otDiff > 0 ? otDiff : 0;
    }

    // Determine new status
    let newStatus = record.status;
    if (isClockIn) {
      newStatus = lateMins > 0 ? "late" : "present";
    } else {
      if (earlyMins > 30) newStatus = "early_leave";
      else if (workDur > 0 && workDur < 300) newStatus = "half_day";
    }

    const updated: AttendanceRecord = {
      ...record,
      ...(isClockIn ? {
        clock_in: timestamp,
        clock_in_address: "Admin — manual entry",
        clock_in_notes: notes || "Clock in oleh admin",
        late_minutes: lateMins,
        status: newStatus,
      } : {
        clock_out: timestamp,
        clock_out_address: "Admin — manual entry",
        clock_out_notes: notes || "Clock out oleh admin",
        work_duration_minutes: workDur,
        early_leave_minutes: earlyMins,
        overtime_minutes: overtime,
        status: record.status === "absent" ? record.status : newStatus,
      }),
      is_manual_entry: true,
      corrected_by: "Sarah Anderson",
      correction_reason: `Admin ${isClockIn ? "clock in" : "clock out"}: ${notes || "manual entry"}`
    };

    onSave(updated);
    onClose();
    toast.success(`${record.employee_name} berhasil di-${isClockIn ? "clock in" : "clock out"}`, {
      description: `Waktu: ${time} — oleh Admin`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn("p-2 rounded-xl", iconBg)}>
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>
            {isClockIn ? "Clock in" : "Clock out"} manual untuk <strong>{record.employee_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="bg-muted/40 rounded-xl p-3 flex items-center gap-3">
            <Avatar className="w-9 h-9 ring-2 ring-background">
              <AvatarImage src={record.employee_avatar} />
              <AvatarFallback>{record.employee_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{record.employee_name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{record.employee_role} • {record.shift_name} • {record.scheduled_start}–{record.scheduled_end}</p>
            </div>
          </div>

          {!isClockIn && record.clock_in && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-medium">Sudah Clock In</p>
              <p className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">{extractTime(record.clock_in)}</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="clock-action-time">Waktu {isClockIn ? "Clock In" : "Clock Out"}</Label>
            <Input
              id="clock-action-time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="font-mono text-lg h-12"
            />
            <p className="text-[10px] text-muted-foreground">Jadwal: {isClockIn ? record.scheduled_start : record.scheduled_end}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clock-action-notes">Catatan (opsional)</Label>
            <Textarea
              id="clock-action-notes"
              placeholder={isClockIn ? "e.g. Karyawan lupa clock in..." : "e.g. Karyawan lupa clock out..."}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} className={cn("gap-2", isClockIn ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700")}>
            <Icon className="w-4 h-4" />
            {isClockIn ? "Clock In" : "Clock Out"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page ---
export function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "clock_in" | "status" | "late">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [correctionRecord, setCorrectionRecord] = useState<AttendanceRecord | null>(null);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [clockActionRecord, setClockActionRecord] = useState<AttendanceRecord | null>(null);
  const [clockActionType, setClockActionType] = useState<"clock_in" | "clock_out">("clock_in");
  const [clockActionOpen, setClockActionOpen] = useState(false);
  const [corrections, setCorrections] = useState<Record<number, AttendanceRecord>>({});
  const [trendRange, setTrendRange] = useState<7 | 30>(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openCorrection = (r: AttendanceRecord) => { setCorrectionRecord(r); setCorrectionOpen(true); };
  const openClockAction = (r: AttendanceRecord, type: "clock_in" | "clock_out") => {
    setClockActionRecord(r); setClockActionType(type); setClockActionOpen(true);
  };
  const handleSaveCorrection = (updated: AttendanceRecord) => {
    setCorrections(prev => ({ ...prev, [updated.id]: updated }));
  };

  const dayRecords = useMemo(() => {
    return ALL_RECORDS.filter(r => r.date === selectedDate).map(r => corrections[r.id] || r);
  }, [selectedDate, corrections]);

  const filtered = useMemo(() => {
    let list = dayRecords;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.employee_name.toLowerCase().includes(q) || r.employee_role.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter(r => r.status === statusFilter);
    if (shiftFilter !== "all") list = list.filter(r => r.shift_name === shiftFilter);
    if (branchFilter !== "all") list = list.filter(r => r.branch_name === branchFilter);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.employee_name.localeCompare(b.employee_name);
      else if (sortField === "clock_in") cmp = (a.clock_in || "z").localeCompare(b.clock_in || "z");
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else if (sortField === "late") cmp = a.late_minutes - b.late_minutes;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [dayRecords, searchQuery, statusFilter, shiftFilter, branchFilter, sortField, sortDir]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, shiftFilter, branchFilter, selectedDate]);

  const stats = useMemo(() => {
    const s = { total: dayRecords.length, present: 0, late: 0, absent: 0, earlyLeave: 0, halfDay: 0, avgWork: 0, totalOvertime: 0, notClockedIn: 0, notClockedOut: 0 };
    let workSum = 0;
    dayRecords.forEach(r => {
      if (r.status === "present") s.present++;
      else if (r.status === "late") s.late++;
      else if (r.status === "absent") s.absent++;
      else if (r.status === "early_leave") s.earlyLeave++;
      else if (r.status === "half_day") s.halfDay++;
      workSum += r.work_duration_minutes;
      s.totalOvertime += r.overtime_minutes;
      if (!r.clock_in && r.status !== "absent") s.notClockedIn++;
      if (r.clock_in && !r.clock_out && r.status !== "absent") s.notClockedOut++;
    });
    s.avgWork = s.total > 0 ? Math.round(workSum / s.total) : 0;
    return s;
  }, [dayRecords]);

  const changeDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    if (d <= new Date(TODAY)) setSelectedDate(d.toISOString().split("T")[0]);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const openDetail = (r: AttendanceRecord) => { setSelectedRecord(r); setDetailOpen(true); };

  const onRate = (pct: number) => pct >= 90 ? "text-emerald-600 dark:text-emerald-400" : pct >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  const presentPct = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Attendance</h2>
          <p className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Daily attendance monitoring and management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => changeDate(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
            <CalendarDays className="w-4 h-4 text-primary" />
            <Input type="date" value={selectedDate} max={TODAY} onChange={e => setSelectedDate(e.target.value)} className="border-0 bg-transparent p-0 h-auto text-sm font-semibold w-[130px] focus-visible:ring-0" />
          </div>
          <Button variant="outline" size="icon" onClick={() => changeDate(1)} disabled={selectedDate >= TODAY}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Report exported!")}><Download className="w-4 h-4" />Export</Button>
        </div>
      </div>

      {/* Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-3">
          <AttendanceRadialCard percentage={presentPct} />
        </div>

        <div className="lg:col-span-4">
          <StatusDistributionCard stats={stats} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          {(() => {
            const trendData = Array.from({ length: trendRange }, (_, i) => {
              const date = new Date(TODAY);
              date.setDate(date.getDate() - (trendRange - 1 - i));
              const dateStr = date.toISOString().split("T")[0];
              const dayRecs = ALL_RECORDS.filter(r => r.date === dateStr);
              if (dayRecs.length === 0) return null;
              const presentCount = dayRecs.filter(r => r.status === "present" || r.status === "late").length;
              return { date: dateStr, rate: Math.round((presentCount / dayRecs.length) * 100) };
            }).filter(Boolean) as { date: string; rate: number }[];

            return <AttendanceTrendCard data={trendData} range={trendRange} onRangeChange={setTrendRange} />;
          })()}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total" value={stats.total} icon={Users} color="bg-primary/10 text-primary" />
            <StatCard label="Avg Work" value={formatDuration(stats.avgWork)} icon={TrendingUp} color="bg-sky-500/10 text-sky-600 dark:text-sky-400" />
            <StatCard label="Overtime" value={formatDuration(stats.totalOvertime)} icon={Timer} color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border rounded-2xl">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search employee..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Shift" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              {SHIFTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Branch" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="text-xs">{filtered.length} records</Badge>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 px-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Attendance Records</CardTitle>
            <CardDescription>{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</CardDescription>
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
                  const showPages = 2; // Number of pages to show around current

                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - 1 && i <= currentPage + 1)
                    ) {
                      if (pages.length > 0 && pages[pages.length - 1] !== i - 1) {
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
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-[250px]"><button className="flex items-center gap-1 font-semibold" onClick={() => toggleSort("name")}>Employee <ArrowUpDown className="w-3 h-3" /></button></TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead><button className="flex items-center gap-1 font-semibold" onClick={() => toggleSort("clock_in")}>Clock In <ArrowUpDown className="w-3 h-3" /></button></TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead><button className="flex items-center gap-1 font-semibold" onClick={() => toggleSort("late")}>Late <ArrowUpDown className="w-3 h-3" /></button></TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedData.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No attendance records found</TableCell></TableRow>
                  ) : paginatedData.map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.015, duration: 0.2 }}
                      className="group border-b hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => openDetail(r)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-background"><AvatarImage src={r.employee_avatar} /><AvatarFallback>{r.employee_name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                          <div>
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">{r.employee_name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{r.employee_role}</p>
                          </div>
                          {r.is_manual_entry && <Badge variant="outline" className="text-[8px] h-4 px-1 bg-amber-500/10 text-amber-600 border-amber-200">M</Badge>}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell><span className="text-xs font-medium text-muted-foreground">{r.shift_name.replace(" Shift", "")}</span></TableCell>
                      <TableCell>
                        {r.clock_in ? (
                          <span className="font-mono text-sm font-semibold">{extractTime(r.clock_in)}</span>
                        ) : r.status !== "absent" ? (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 gap-1">
                            <LogIn className="w-3 h-3" />Belum Clock In
                          </Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {r.clock_out ? (
                          <span className="font-mono text-sm">{extractTime(r.clock_out)}</span>
                        ) : r.clock_in && r.status !== "absent" ? (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 gap-1">
                            <LogOut className="w-3 h-3" />Belum Clock Out
                          </Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {r.late_minutes > 0 ? (
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">{r.late_minutes}m</span>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell><span className="text-xs font-medium">{formatDuration(r.work_duration_minutes)}</span></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-3.5 h-3.5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); openDetail(r); }}><Eye className="w-4 h-4 mr-2" />View Detail</DropdownMenuItem>
                            {!r.clock_in && r.status !== "absent" && (
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); openClockAction(r, "clock_in"); }} className="text-emerald-600 dark:text-emerald-400">
                                <LogIn className="w-4 h-4 mr-2" />Clock In
                              </DropdownMenuItem>
                            )}
                            {r.clock_in && !r.clock_out && r.status !== "absent" && (
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); openClockAction(r, "clock_out"); }} className="text-sky-600 dark:text-sky-400">
                                <LogOut className="w-4 h-4 mr-2" />Clock Out
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); openCorrection(r); }}><Edit className="w-4 h-4 mr-2" />Correct Entry</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>


        </CardContent>
      </Card>

      {/* Detail Modal */}
      <DetailModal record={selectedRecord} open={detailOpen} onClose={() => setDetailOpen(false)} />

      {/* Correction Dialog */}
      <CorrectionDialog record={correctionRecord} open={correctionOpen} onClose={() => setCorrectionOpen(false)} onSave={handleSaveCorrection} />

      {/* Clock Action Dialog */}
      <ClockActionDialog record={clockActionRecord} action={clockActionType} open={clockActionOpen} onClose={() => setClockActionOpen(false)} onSave={handleSaveCorrection} />
    </div>
  );
}
