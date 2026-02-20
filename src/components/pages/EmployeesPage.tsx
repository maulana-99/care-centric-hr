import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, Plus, MoreVertical, Mail, Phone, MapPin,
  CalendarDays, Briefcase, ChevronRight, UserPlus, Download,
  ArrowUpDown, ExternalLink, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types ---
type EmployeeStatus = "active" | "on_leave" | "terminated" | "remote";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  email: string;
  phone: string;
  location: string;
  join_date: string;
  avatar: string;
}

// --- Mock Data ---
const DEPARTMENTS = ["Engineering", "Design", "Product", "Human Resources", "Marketing", "Sales", "Customer Success", "Finance"];
const LOCATIONS = ["Jakarta, Indonesia", "Bandung, Indonesia", "Surabaya, Indonesia", "Remote"];

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: "Sarah Anderson", role: "HR Manager", department: "Human Resources", status: "active", email: "sarah.a@company.com", phone: "+62 812-3456-7890", location: "Jakarta, Indonesia", join_date: "2023-01-15", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "John Doe", role: "Senior Developer", department: "Engineering", status: "active", email: "john.d@company.com", phone: "+62 812-9876-5432", location: "Bandung, Indonesia", join_date: "2022-03-20", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Emily Wilson", role: "UI/UX Designer", department: "Design", status: "remote", email: "emily.w@company.com", phone: "+62 813-2233-4455", location: "Remote", join_date: "2023-06-12", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Michael Brown", role: "Product Designer", department: "Design", status: "active", email: "michael.b@company.com", phone: "+62 814-5566-7788", location: "Jakarta, Indonesia", join_date: "2022-11-05", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Jessica Lee", role: "Product Manager", department: "Product", status: "on_leave", email: "jessica.l@company.com", phone: "+62 815-9900-1122", location: "Jakarta, Indonesia", join_date: "2021-08-28", avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "David Miller", role: "Backend Engineer", department: "Engineering", status: "active", email: "david.m@company.com", phone: "+62 816-3344-5566", location: "Surabaya, Indonesia", join_date: "2023-09-01", avatar: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "Sophia Taylor", role: "QA Lead", department: "Engineering", status: "active", email: "sophia.t@company.com", phone: "+62 817-7788-9900", location: "Jakarta, Indonesia", join_date: "2022-05-15", avatar: "https://i.pravatar.cc/150?u=7" },
  { id: 8, name: "James Wilson", role: "Frontend Dev", department: "Engineering", status: "active", email: "james.w@company.com", phone: "+62 818-1122-3344", location: "Bandung, Indonesia", join_date: "2024-01-10", avatar: "https://i.pravatar.cc/150?u=8" },
  { id: 9, name: "Olivia Davis", role: "Marketing Specialist", department: "Marketing", status: "remote", email: "olivia.d@company.com", phone: "+62 819-5566-7788", location: "Remote", join_date: "2023-03-22", avatar: "https://i.pravatar.cc/150?u=9" },
  { id: 10, name: "Daniel Martinez", role: "DevOps Engineer", department: "Engineering", status: "active", email: "daniel.m@company.com", phone: "+62 820-9900-1122", location: "Jakarta, Indonesia", join_date: "2022-10-14", avatar: "https://i.pravatar.cc/150?u=10" },
];

const STATUS_CONFIG: Record<EmployeeStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  on_leave: { label: "On Leave", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  terminated: { label: "Terminated", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  remote: { label: "Remote", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
};

export function EmployeesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "join_date" | "role">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let list = [...MOCK_EMPLOYEES];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    if (deptFilter !== "all") list = list.filter(e => e.department === deptFilter);
    if (statusFilter !== "all") list = list.filter(e => e.status === statusFilter);

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "join_date") cmp = a.join_date.localeCompare(b.join_date);
      else if (sortField === "role") cmp = a.role.localeCompare(b.role);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [searchQuery, deptFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Employee Directory</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Manage and view all members of your organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Directory exported!")}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <Card className="border rounded-2xl overflow-hidden">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-muted/30 focus-visible:ring-primary/20"
              />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-[160px] h-11 rounded-xl">
                <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center bg-muted/40 p-1 rounded-xl border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className={cn("h-8 px-3 rounded-lg text-xs font-semibold shadow-none transition-all", viewMode === "grid" && "bg-background shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className={cn("h-8 px-3 rounded-lg text-xs font-semibold shadow-none transition-all", viewMode === "list" && "bg-background shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((employee, i) => (
              <EmployeeCard key={employee.id} employee={employee} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground transition-all" onClick={() => toggleSort("name")}>
                          Employee <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground transition-all" onClick={() => toggleSort("role")}>
                          Department / Role <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground transition-all" onClick={() => toggleSort("join_date")}>
                          Join Date <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((e, i) => (
                      <motion.tr
                        key={e.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="group hover:bg-muted/20 transition-all cursor-pointer"
                        onClick={() => toast.info(`Viewing profile: ${e.name}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                              <AvatarImage src={e.avatar} />
                              <AvatarFallback>{e.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold group-hover:text-primary transition-colors">{e.name}</p>
                              <p className="text-xs text-muted-foreground">{e.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={e.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium">{e.department}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{e.role}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {e.location.split(",")[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-mono">
                            <CalendarDays className="w-3 h-3 text-muted-foreground" />
                            {new Date(e.join_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem className="rounded-lg gap-2"><ExternalLink className="w-4 h-4" /> View Profile</DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2"><Mail className="w-4 h-4" /> Message</DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg gap-2"><Plus className="w-4 h-4" /> Assign Shift</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="bg-card border-2 border-dashed rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold">No employees found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-1">
            We couldn't find any employees matching your search criteria. Try adjusting your filters.
          </p>
          <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearchQuery(""); setDeptFilter("all"); setStatusFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function EmployeeCard({ employee, index }: { employee: Employee; index: number }) {
  const sc = STATUS_CONFIG[employee.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group border hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 rounded-3xl overflow-hidden bg-card">
        <div className="relative h-24 bg-muted/30 group-hover:bg-primary/5 transition-colors">
          <div className="absolute top-4 left-4">
            <StatusBadge status={employee.status} />
          </div>
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80 rounded-full">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-primary/10">
                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><ExternalLink className="w-4 h-4" /> Full Profile</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><Mail className="w-4 h-4" /> Send Email</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary"><Phone className="w-4 h-4" /> Call Karyawan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="px-6 pb-6 pt-0 relative -mt-10">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 border-4 border-card shadow-lg ring-1 ring-primary/10">
              <AvatarImage src={employee.avatar} className="object-cover" />
              <AvatarFallback className="text-lg font-bold">{employee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>

            <div className="mt-4 space-y-1">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{employee.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{employee.role}</p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold py-1 px-2.5 bg-primary/5 text-primary rounded-full mt-1">
                <Briefcase className="w-3 h-3" /> {employee.department}
              </div>
            </div>

            <div className="w-full h-px bg-border my-5" />

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground truncate">{employee.location}</span>
              </div>
            </div>

            <Button className="w-full mt-6 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground text-foreground border-0 transition-all gap-2 py-5" variant="outline">
              View Profile <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: EmployeeStatus }) {
  const sc = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", sc.bg, sc.color)}>
      <span className={cn("w-1 h-1 rounded-full mr-1.5", sc.color.replace("text-", "bg-"))} />
      {sc.label}
    </Badge>
  );
}
