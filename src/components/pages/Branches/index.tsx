import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MapPin, Plus, Search, Building2, CheckCircle2, XCircle,
    MoreVertical, Pencil, Trash2, ArrowUpDown, Globe2, Radius,
    Users, UserPlus, X, GripVertical, Mail, Briefcase, Eye,
    ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    DndContext, closestCenter, DragOverlay,
    useSensor, useSensors, PointerSensor,
    type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";

// --- Types ---
interface Branch {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    geo_radius_meters: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SimpleEmployee {
    id: number;
    name: string;
    role: string;
    department: string;
    avatar: string;
    email: string;
}

type SortField = "name" | "city" | "is_active";
type SortDir = "asc" | "desc";

// --- Mock Data ---
const INITIAL_BRANCHES: Branch[] = [
    {
        id: 1, name: "HQ Jakarta", address: "Jl. Sudirman No. 1, Senayan", city: "Jakarta",
        latitude: -6.2088, longitude: 106.8456, geo_radius_meters: 200, is_active: true,
        created_at: "2024-01-15T08:00:00Z", updated_at: "2024-12-01T10:00:00Z",
    },
    {
        id: 2, name: "Bandung Office", address: "Jl. Braga No. 45", city: "Bandung",
        latitude: -6.9175, longitude: 107.6191, geo_radius_meters: 150, is_active: true,
        created_at: "2024-03-20T08:00:00Z", updated_at: "2024-11-15T10:00:00Z",
    },
    {
        id: 3, name: "Surabaya Branch", address: "Jl. Basuki Rahmat No. 12", city: "Surabaya",
        latitude: -7.2575, longitude: 112.7521, geo_radius_meters: 180, is_active: true,
        created_at: "2024-05-10T08:00:00Z", updated_at: "2024-10-20T10:00:00Z",
    },
    {
        id: 4, name: "Yogyakarta Hub", address: "Jl. Malioboro No. 88", city: "Yogyakarta",
        latitude: -7.7956, longitude: 110.3695, geo_radius_meters: 120, is_active: false,
        created_at: "2024-06-01T08:00:00Z", updated_at: "2024-09-05T10:00:00Z",
    },
    {
        id: 5, name: "Bali Creative Space", address: "Jl. Sunset Road No. 77, Seminyak", city: "Bali",
        latitude: -8.6995, longitude: 115.1683, geo_radius_meters: 250, is_active: true,
        created_at: "2024-07-12T08:00:00Z", updated_at: "2025-01-10T10:00:00Z",
    },
    {
        id: 6, name: "Medan Office", address: "Jl. Gatot Subroto No. 30", city: "Medan",
        latitude: 3.5952, longitude: 98.6722, geo_radius_meters: 160, is_active: false,
        created_at: "2024-08-25T08:00:00Z", updated_at: "2024-12-20T10:00:00Z",
    },
];

const ALL_EMPLOYEES: SimpleEmployee[] = [
    { id: 1, name: "Sarah Anderson", role: "HR Manager", department: "Human Resources", avatar: "https://i.pravatar.cc/150?u=1", email: "sarah.a@company.com" },
    { id: 2, name: "John Doe", role: "Senior Developer", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=2", email: "john.d@company.com" },
    { id: 3, name: "Emily Wilson", role: "UI/UX Designer", department: "Design", avatar: "https://i.pravatar.cc/150?u=3", email: "emily.w@company.com" },
    { id: 4, name: "Michael Brown", role: "Product Designer", department: "Design", avatar: "https://i.pravatar.cc/150?u=4", email: "michael.b@company.com" },
    { id: 5, name: "Jessica Lee", role: "Product Manager", department: "Product", avatar: "https://i.pravatar.cc/150?u=5", email: "jessica.l@company.com" },
    { id: 6, name: "David Miller", role: "Backend Engineer", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=6", email: "david.m@company.com" },
    { id: 7, name: "Sophia Taylor", role: "QA Lead", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=7", email: "sophia.t@company.com" },
    { id: 8, name: "James Wilson", role: "Frontend Dev", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=8", email: "james.w@company.com" },
    { id: 9, name: "Olivia Davis", role: "Marketing Specialist", department: "Marketing", avatar: "https://i.pravatar.cc/150?u=9", email: "olivia.d@company.com" },
    { id: 10, name: "Daniel Martinez", role: "DevOps Engineer", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=10", email: "daniel.m@company.com" },
    { id: 11, name: "Robert Gray", role: "Finance Lead", department: "Finance", avatar: "https://i.pravatar.cc/150?u=11", email: "robert.g@company.com" },
    { id: 12, name: "Amanda Chen", role: "Data Analyst", department: "Engineering", avatar: "https://i.pravatar.cc/150?u=12", email: "amanda.c@company.com" },
];

const INITIAL_ASSIGNMENTS: Record<number, number[]> = {
    1: [1, 2, 7, 10],   // HQ Jakarta
    2: [4, 8],           // Bandung
    3: [6],              // Surabaya
};

const EMPTY_FORM: Omit<Branch, "id" | "created_at" | "updated_at"> = {
    name: "", address: "", city: "",
    latitude: 0, longitude: 0, geo_radius_meters: 100, is_active: true,
};

// --- Draggable Employee Card ---
function DraggableEmployee({ employee, onClick }: { employee: SimpleEmployee; onClick?: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `employee-${employee.id}`,
        data: { employee },
    });

    const style = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-all cursor-grab active:cursor-grabbing group",
                isDragging && "opacity-40 scale-95 shadow-lg z-50"
            )}
            {...listeners}
            {...attributes}
        >
            <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <Avatar className="w-9 h-9 border-2 border-background shadow-sm shrink-0">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-xs font-bold">{employee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{employee.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{employee.role} · {employee.department}</p>
            </div>
            {onClick && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <UserPlus className="w-3.5 h-3.5" />
                </Button>
            )}
        </div>
    );
}

// --- Employee Overlay (shown while dragging) ---
function EmployeeOverlay({ employee }: { employee: SimpleEmployee }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-primary/30 bg-card shadow-2xl w-[280px]">
            <GripVertical className="w-4 h-4 text-primary/40 shrink-0" />
            <Avatar className="w-9 h-9 border-2 border-primary/20 shadow-sm shrink-0">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-xs font-bold">{employee.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{employee.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{employee.role}</p>
            </div>
        </div>
    );
}

// --- Drop Zone ---
function BranchDropZone({ children, branchName }: { children: React.ReactNode; branchName: string }) {
    const { isOver, setNodeRef } = useDroppable({ id: "branch-drop-zone" });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 min-h-0 flex flex-col rounded-2xl border-2 border-dashed transition-all duration-200",
                isOver
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-border/50 bg-muted/10"
            )}
        >
            <div className="p-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-sm">{branchName}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isOver ? "Release to assign employee here" : "Drag employees here or click the + button"}
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {children}
            </div>
        </div>
    );
}


// --- Main Component ---
export function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
    const [searchQuery, setSearchQuery] = useState("");
    const [cityFilter, setCityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Dialog state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    // Assignment state
    const [assignments, setAssignments] = useState<Record<number, number[]>>(INITIAL_ASSIGNMENTS);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignBranch, setAssignBranch] = useState<Branch | null>(null);
    const [assignSearch, setAssignSearch] = useState("");
    const [activeEmployee, setActiveEmployee] = useState<SimpleEmployee | null>(null);

    // Detail view state
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailBranch, setDetailBranch] = useState<Branch | null>(null);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Stats
    const totalBranches = branches.length;
    const activeBranches = branches.filter(b => b.is_active).length;
    const uniqueCities = new Set(branches.map(b => b.city)).size;

    // Derive city list for filter
    const cityList = useMemo(() => {
        return [...new Set(branches.map(b => b.city))].sort();
    }, [branches]);

    // Filter & Sort
    const filtered = useMemo(() => {
        let list = branches.filter(b =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (cityFilter !== "all") list = list.filter(b => b.city === cityFilter);
        if (statusFilter !== "all") list = list.filter(b => statusFilter === "active" ? b.is_active : !b.is_active);
        list.sort((a, b) => {
            let cmp = 0;
            if (sortField === "name") cmp = a.name.localeCompare(b.name);
            else if (sortField === "city") cmp = a.city.localeCompare(b.city);
            else if (sortField === "is_active") cmp = Number(b.is_active) - Number(a.is_active);
            return sortDir === "asc" ? cmp : -cmp;
        });
        return list;
    }, [branches, searchQuery, cityFilter, statusFilter, sortField, sortDir]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, cityFilter, statusFilter, sortField, sortDir]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("asc"); }
    };

    // Branch employee count helper
    const getAssignedCount = (branchId: number) => (assignments[branchId] || []).length;

    // Assignment helpers
    const assignedIds = useMemo(() => {
        const ids = new Set<number>();
        Object.values(assignments).forEach(arr => arr.forEach(id => ids.add(id)));
        return ids;
    }, [assignments]);

    const unassignedEmployees = useMemo(() => {
        const branchIds = assignBranch ? (assignments[assignBranch.id] || []) : [];
        return ALL_EMPLOYEES.filter(e =>
            !assignedIds.has(e.id) &&
            (e.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
                e.role.toLowerCase().includes(assignSearch.toLowerCase()) ||
                e.department.toLowerCase().includes(assignSearch.toLowerCase()))
        );
    }, [assignedIds, assignSearch, assignBranch, assignments]);

    const assignedEmployees = useMemo(() => {
        if (!assignBranch) return [];
        const ids = assignments[assignBranch.id] || [];
        return ALL_EMPLOYEES.filter(e => ids.includes(e.id));
    }, [assignBranch, assignments]);

    // Form handlers
    const openAdd = () => {
        setEditingBranch(null);
        setForm(EMPTY_FORM);
        setIsFormOpen(true);
    };

    const openEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setForm({
            name: branch.name, address: branch.address, city: branch.city,
            latitude: branch.latitude, longitude: branch.longitude,
            geo_radius_meters: branch.geo_radius_meters, is_active: branch.is_active,
        });
        setIsFormOpen(true);
    };

    const openDelete = (branch: Branch) => {
        setDeletingBranch(branch);
        setIsDeleteOpen(true);
    };

    const openAssign = (branch: Branch) => {
        setAssignBranch(branch);
        setAssignSearch("");
        setIsAssignOpen(true);
    };

    const openDetail = (branch: Branch) => {
        setDetailBranch(branch);
        setIsDetailOpen(true);
    };

    const getEmployeesForBranch = (branchId: number) => {
        const ids = assignments[branchId] || [];
        return ALL_EMPLOYEES.filter(e => ids.includes(e.id));
    };

    const handleSave = () => {
        if (!form.name.trim()) { toast.error("Branch name is required"); return; }
        const now = new Date().toISOString();
        if (editingBranch) {
            setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...form, updated_at: now } : b));
            toast.success(`Branch "${form.name}" updated`);
        } else {
            const newBranch: Branch = {
                ...form, id: Math.max(0, ...branches.map(b => b.id)) + 1,
                created_at: now, updated_at: now,
            };
            setBranches(prev => [...prev, newBranch]);
            toast.success(`Branch "${form.name}" created`);
        }
        setIsFormOpen(false);
    };

    const handleDelete = () => {
        if (!deletingBranch) return;
        setBranches(prev => prev.filter(b => b.id !== deletingBranch.id));
        toast.success(`Branch "${deletingBranch.name}" deleted`);
        setIsDeleteOpen(false);
        setDeletingBranch(null);
    };

    const toggleActive = (branch: Branch) => {
        setBranches(prev => prev.map(b =>
            b.id === branch.id ? { ...b, is_active: !b.is_active, updated_at: new Date().toISOString() } : b
        ));
        toast.success(`Branch "${branch.name}" ${branch.is_active ? "deactivated" : "activated"}`);
    };

    // Assignment drag handlers
    const handleDragStart = (event: DragStartEvent) => {
        const emp = event.active.data.current?.employee as SimpleEmployee;
        if (emp) setActiveEmployee(emp);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveEmployee(null);
        const { active, over } = event;
        if (!over || !assignBranch) return;
        if (over.id === "branch-drop-zone") {
            const emp = active.data.current?.employee as SimpleEmployee;
            if (emp) assignEmployee(emp.id);
        }
    };

    const assignEmployee = (empId: number) => {
        if (!assignBranch) return;
        setAssignments(prev => {
            const current = prev[assignBranch.id] || [];
            if (current.includes(empId)) return prev;
            return { ...prev, [assignBranch.id]: [...current, empId] };
        });
        const emp = ALL_EMPLOYEES.find(e => e.id === empId);
        toast.success(`${emp?.name} assigned to ${assignBranch.name}`);
    };

    const unassignEmployee = (empId: number) => {
        if (!assignBranch) return;
        setAssignments(prev => ({
            ...prev,
            [assignBranch.id]: (prev[assignBranch.id] || []).filter(id => id !== empId),
        }));
        const emp = ALL_EMPLOYEES.find(e => e.id === empId);
        toast.success(`${emp?.name} removed from ${assignBranch.name}`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-brand-dark">Branches</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Manage company branch locations and geofencing
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={openAdd} className="gap-2 gradient-primary shadow-lg shadow-primary/20 rounded-xl px-5 py-5">
                        <Plus className="w-4 h-4" /> Add Branch
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Branches</p>
                            <h3 className="text-2xl font-bold">{totalBranches}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Branches</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold">{activeBranches}</h3>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                                    {Math.round((activeBranches / totalBranches) * 100)}% active
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                            <Globe2 className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cities Covered</p>
                            <h3 className="text-2xl font-bold">{uniqueCities}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border rounded-2xl">
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search branch or city..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="w-[160px]"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="City" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cityList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="text-xs">{filtered.length} records</Badge>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="border rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 px-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg">Branch Records</CardTitle>
                        <CardDescription>Manage company branch locations</CardDescription>
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
                                    const pages: (number | string)[] = [];
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
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                <TableHead className="w-[50px] pl-6">#</TableHead>
                                <TableHead>
                                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 font-semibold hover:text-primary transition-colors">
                                        Branch Name <ArrowUpDown className="w-3.5 h-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead>
                                    <button onClick={() => toggleSort("city")} className="flex items-center gap-1 font-semibold hover:text-primary transition-colors">
                                        City <ArrowUpDown className="w-3.5 h-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead className="hidden xl:table-cell">Address</TableHead>
                                <TableHead className="hidden lg:table-cell">Coordinates</TableHead>
                                <TableHead className="hidden lg:table-cell">
                                    <span className="flex items-center gap-1"><Radius className="w-3.5 h-3.5" /> Radius</span>
                                </TableHead>
                                <TableHead>
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Employees</span>
                                </TableHead>
                                <TableHead>
                                    <button onClick={() => toggleSort("is_active")} className="flex items-center gap-1 font-semibold hover:text-primary transition-colors">
                                        Status <ArrowUpDown className="w-3.5 h-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <MapPin className="w-8 h-8 opacity-30" />
                                                <p>No branches found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedData.map((branch, i) => (
                                        <motion.tr
                                            key={branch.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="group hover:bg-muted/20 transition-all cursor-pointer border-b last:border-0"
                                            onClick={() => openDetail(branch)}
                                        >
                                            <td className="px-6 py-5 font-mono text-[10px] text-muted-foreground/50">{String(branch.id).slice(0, 8)}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border shadow-sm",
                                                        branch.is_active
                                                            ? "bg-primary/10 text-primary border-primary/20"
                                                            : "bg-muted text-muted-foreground border-border/50"
                                                    )}>
                                                        {branch.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{branch.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                                            Updated {new Date(branch.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-sm">{branch.city}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                <p className="text-sm text-muted-foreground max-w-[200px] truncate">{branch.address}</p>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">
                                                    {branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}
                                                </code>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm font-medium">{branch.geo_radius_meters}m</span>
                                            </TableCell>
                                            <td className="px-6 py-5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-1.5 h-8 px-3 rounded-lg text-[11px] font-bold border border-border/50 hover:bg-primary/5 hover:text-primary shadow-sm"
                                                    onClick={(e) => { e.stopPropagation(); openAssign(branch); }}
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                    {getAssignedCount(branch.id)}
                                                </Button>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div
                                                    className={cn(
                                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize transition-colors cursor-pointer",
                                                        branch.is_active
                                                            ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                                                            : "text-rose-500 bg-red-500/10 border-rose-500/20 hover:bg-red-500/20"
                                                    )}
                                                    onClick={(e) => { e.stopPropagation(); toggleActive(branch); }}
                                                >
                                                    {branch.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {branch.is_active ? "Active" : "Inactive"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:text-primary">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl w-48">
                                                        <DropdownMenuItem onClick={() => openAssign(branch)} className="gap-2 cursor-pointer rounded-lg">
                                                            <Users className="w-4 h-4" /> Assign Employees
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(branch)} className="gap-2 cursor-pointer rounded-lg">
                                                            <Pencil className="w-4 h-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDelete(branch)} className="gap-2 cursor-pointer text-destructive focus:text-destructive rounded-lg">
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[520px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{editingBranch ? "Edit Branch" : "Add New Branch"}</DialogTitle>
                        <DialogDescription>
                            {editingBranch ? "Update the branch information below." : "Fill in the details for the new branch."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-semibold">Branch Name *</Label>
                            <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. HQ Jakarta" className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city" className="font-semibold">City</Label>
                                <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Jakarta" className="rounded-xl" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="geo_radius" className="font-semibold">Geo Radius (m)</Label>
                                <Input id="geo_radius" type="number" value={form.geo_radius_meters} onChange={e => setForm(f => ({ ...f, geo_radius_meters: Number(e.target.value) }))} placeholder="100" className="rounded-xl" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address" className="font-semibold">Address</Label>
                            <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full street address" className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="latitude" className="font-semibold">Latitude</Label>
                                <Input id="latitude" type="number" step="0.0001" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: Number(e.target.value) }))} placeholder="-6.2088" className="rounded-xl font-mono text-sm" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="longitude" className="font-semibold">Longitude</Label>
                                <Input id="longitude" type="number" step="0.0001" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: Number(e.target.value) }))} placeholder="106.8456" className="rounded-xl font-mono text-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                            <div>
                                <Label htmlFor="is_active" className="font-semibold">Active Status</Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Enable or disable this branch location</p>
                            </div>
                            <Switch id="is_active" checked={form.is_active} onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleSave} className="gradient-primary rounded-xl shadow-lg shadow-primary/20 px-6">
                            {editingBranch ? "Save Changes" : "Create Branch"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-destructive">Delete Branch</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong className="text-foreground">{deletingBranch?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} className="rounded-xl px-6">Delete Branch</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Employees Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[85vh] rounded-2xl p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Assign Employees
                        </DialogTitle>
                        <DialogDescription>
                            Drag employees from the left panel to assign them to <strong className="text-foreground">{assignBranch?.name}</strong>, or click the <UserPlus className="w-3.5 h-3.5 inline" /> button.
                        </DialogDescription>
                    </DialogHeader>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex h-[55vh]">
                            {/* Left: Unassigned employees */}
                            <div className="w-[340px] border-r flex flex-col bg-muted/5">
                                <div className="p-4 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search employees..."
                                            value={assignSearch}
                                            onChange={e => setAssignSearch(e.target.value)}
                                            className="pl-10 h-10 rounded-xl bg-background text-sm"
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                                        {unassignedEmployees.length} unassigned employee{unassignedEmployees.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    <AnimatePresence>
                                        {unassignedEmployees.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                                                <Users className="w-8 h-8 opacity-30 mb-2" />
                                                <p className="text-sm">No unassigned employees</p>
                                            </div>
                                        ) : (
                                            unassignedEmployees.map(emp => (
                                                <motion.div
                                                    key={emp.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    layout
                                                >
                                                    <DraggableEmployee
                                                        employee={emp}
                                                        onClick={() => assignEmployee(emp.id)}
                                                    />
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right: Branch assigned employees */}
                            <div className="flex-1 flex flex-col p-4">
                                <BranchDropZone branchName={assignBranch?.name || ""}>
                                    <AnimatePresence>
                                        {assignedEmployees.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                                                <UserPlus className="w-10 h-10 opacity-20 mb-3" />
                                                <p className="text-sm font-medium">No employees assigned yet</p>
                                                <p className="text-xs mt-1">Drag employees here to assign them</p>
                                            </div>
                                        ) : (
                                            assignedEmployees.map(emp => (
                                                <motion.div
                                                    key={emp.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    layout
                                                    className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-all group"
                                                >
                                                    <Avatar className="w-9 h-9 border-2 border-primary/10 shadow-sm shrink-0">
                                                        <AvatarImage src={emp.avatar} />
                                                        <AvatarFallback className="text-xs font-bold">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{emp.name}</p>
                                                        <p className="text-[11px] text-muted-foreground truncate">{emp.role} · {emp.department}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={() => unassignEmployee(emp.id)}
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </BranchDropZone>
                            </div>
                        </div>

                        {/* Drag Overlay */}
                        <DragOverlay>
                            {activeEmployee ? <EmployeeOverlay employee={activeEmployee} /> : null}
                        </DragOverlay>
                    </DndContext>

                    <div className="p-4 border-t bg-muted/5 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">{assignedEmployees.length}</strong> employee{assignedEmployees.length !== 1 ? 's' : ''} assigned
                        </p>
                        <Button onClick={() => setIsAssignOpen(false)} className="rounded-xl px-6">
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Branch Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 gap-0 overflow-hidden">
                    {detailBranch && (() => {
                        const branchEmployees = getEmployeesForBranch(detailBranch.id);
                        return (
                            <>
                                {/* Header with gradient */}
                                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm",
                                                detailBranch.is_active
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            )}>
                                                {detailBranch.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{detailBranch.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">{detailBranch.city}</span>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "gap-1 text-[10px] font-semibold py-0 h-5",
                                                            detailBranch.is_active
                                                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                                                                : "text-red-500 bg-red-500/10 border-red-500/20"
                                                        )}
                                                    >
                                                        {detailBranch.is_active ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                                                        {detailBranch.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="px-6 pt-4 pb-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-muted/30 border">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Address</p>
                                            <p className="text-sm font-medium">{detailBranch.address}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/30 border">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Coordinates</p>
                                            <code className="text-xs font-mono">{detailBranch.latitude.toFixed(4)}, {detailBranch.longitude.toFixed(4)}</code>
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/30 border">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Geo Radius</p>
                                            <p className="text-sm font-medium">{detailBranch.geo_radius_meters}m</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/30 border">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Created</p>
                                            <p className="text-sm font-medium">{new Date(detailBranch.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Assigned Employees */}
                                <div className="px-6 pt-3 pb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            Assigned Employees
                                            <Badge variant="secondary" className="text-[10px] h-5 px-2 font-bold">
                                                {branchEmployees.length}
                                            </Badge>
                                        </h4>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 h-7 text-xs rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                            onClick={() => { setIsDetailOpen(false); setTimeout(() => openAssign(detailBranch), 200); }}
                                        >
                                            <UserPlus className="w-3 h-3" /> Manage
                                        </Button>
                                    </div>

                                    {branchEmployees.length === 0 ? (
                                        <div className="flex flex-col items-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                                            <Users className="w-8 h-8 opacity-20 mb-2" />
                                            <p className="text-sm font-medium">No employees assigned</p>
                                            <p className="text-xs mt-0.5">Click "Manage" to assign employees</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                            {branchEmployees.map((emp, idx) => (
                                                <motion.div
                                                    key={emp.id}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                                                >
                                                    <Avatar className="w-10 h-10 border-2 border-background shadow-sm shrink-0">
                                                        <AvatarImage src={emp.avatar} />
                                                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                            {emp.name.split(" ").map(n => n[0]).join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold truncate">{emp.name}</p>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" /> {emp.role}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {emp.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
