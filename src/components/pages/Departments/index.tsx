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
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Building2, Plus, Search, CheckCircle2, XCircle,
    MoreVertical, Pencil, Trash2, ArrowUpDown, Users,
    Layers, ChevronRight, ChevronDown, GitBranch,
    Eye, Network, FolderTree, Filter,
    UserPlus, X, GripVertical, ChevronLeft, TrendingUp,
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
interface Department {
    id: number;
    name: string;
    code: string;
    parent_id: number | null;
    manager_id: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SimpleEmployee {
    id: number;
    name: string;
    role: string;
    avatar: string;
    email: string;
    department_id: number;
}

type SortField = "name" | "code" | "is_active";
type SortDir = "asc" | "desc";
type ViewMode = "table" | "tree";

// --- Mock Data ---
const INITIAL_DEPARTMENTS: Department[] = [
    {
        id: 1, name: "Engineering", code: "ENG",
        parent_id: null, manager_id: 10, is_active: true,
        created_at: "2024-01-10T08:00:00Z", updated_at: "2025-01-15T10:00:00Z",
    },
    {
        id: 2, name: "Frontend", code: "ENG-FE",
        parent_id: 1, manager_id: 8, is_active: true,
        created_at: "2024-02-01T08:00:00Z", updated_at: "2025-01-10T10:00:00Z",
    },
    {
        id: 3, name: "Backend", code: "ENG-BE",
        parent_id: 1, manager_id: 6, is_active: true,
        created_at: "2024-02-01T08:00:00Z", updated_at: "2025-01-10T10:00:00Z",
    },
    {
        id: 4, name: "DevOps", code: "ENG-DO",
        parent_id: 1, manager_id: 10, is_active: true,
        created_at: "2024-03-12T08:00:00Z", updated_at: "2025-01-10T10:00:00Z",
    },
    {
        id: 5, name: "Design", code: "DSN",
        parent_id: null, manager_id: 4, is_active: true,
        created_at: "2024-01-15T08:00:00Z", updated_at: "2024-12-20T10:00:00Z",
    },
    {
        id: 6, name: "Product", code: "PRD",
        parent_id: null, manager_id: 5, is_active: true,
        created_at: "2024-01-20T08:00:00Z", updated_at: "2024-11-10T10:00:00Z",
    },
    {
        id: 7, name: "Human Resources", code: "HR",
        parent_id: null, manager_id: 1, is_active: true,
        created_at: "2024-01-05T08:00:00Z", updated_at: "2025-02-01T10:00:00Z",
    },
    {
        id: 8, name: "Recruitment", code: "HR-REC",
        parent_id: 7, manager_id: 1, is_active: true,
        created_at: "2024-04-10T08:00:00Z", updated_at: "2025-01-20T10:00:00Z",
    },
    {
        id: 9, name: "Marketing", code: "MKT",
        parent_id: null, manager_id: 9, is_active: true,
        created_at: "2024-02-10T08:00:00Z", updated_at: "2025-01-05T10:00:00Z",
    },
    {
        id: 10, name: "Finance", code: "FIN",
        parent_id: null, manager_id: 11, is_active: true,
        created_at: "2024-01-08T08:00:00Z", updated_at: "2025-01-25T10:00:00Z",
    },
    {
        id: 11, name: "Quality Assurance", code: "ENG-QA",
        parent_id: 1, manager_id: 7, is_active: false,
        created_at: "2024-05-20T08:00:00Z", updated_at: "2024-10-15T10:00:00Z",
    },
];

const ALL_EMPLOYEES: SimpleEmployee[] = [
    { id: 1, name: "Sarah Anderson", role: "HR Manager", avatar: "https://i.pravatar.cc/150?u=1", email: "sarah.a@company.com", department_id: 7 },
    { id: 2, name: "John Doe", role: "Senior Developer", avatar: "https://i.pravatar.cc/150?u=2", email: "john.d@company.com", department_id: 2 },
    { id: 3, name: "Emily Wilson", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/150?u=3", email: "emily.w@company.com", department_id: 5 },
    { id: 4, name: "Michael Brown", role: "Design Lead", avatar: "https://i.pravatar.cc/150?u=4", email: "michael.b@company.com", department_id: 5 },
    { id: 5, name: "Jessica Lee", role: "Product Manager", avatar: "https://i.pravatar.cc/150?u=5", email: "jessica.l@company.com", department_id: 6 },
    { id: 6, name: "David Miller", role: "Backend Lead", avatar: "https://i.pravatar.cc/150?u=6", email: "david.m@company.com", department_id: 3 },
    { id: 7, name: "Sophia Taylor", role: "QA Lead", avatar: "https://i.pravatar.cc/150?u=7", email: "sophia.t@company.com", department_id: 11 },
    { id: 8, name: "James Wilson", role: "Frontend Lead", avatar: "https://i.pravatar.cc/150?u=8", email: "james.w@company.com", department_id: 2 },
    { id: 9, name: "Olivia Davis", role: "Marketing Head", avatar: "https://i.pravatar.cc/150?u=9", email: "olivia.d@company.com", department_id: 9 },
    { id: 10, name: "Daniel Martinez", role: "DevOps Lead", avatar: "https://i.pravatar.cc/150?u=10", email: "daniel.m@company.com", department_id: 4 },
    { id: 11, name: "Robert Gray", role: "Finance Lead", avatar: "https://i.pravatar.cc/150?u=11", email: "robert.g@company.com", department_id: 10 },
    { id: 12, name: "Amanda Chen", role: "Data Analyst", avatar: "https://i.pravatar.cc/150?u=12", email: "amanda.c@company.com", department_id: 3 },
    { id: 13, name: "Kevin Park", role: "Junior Developer", avatar: "https://i.pravatar.cc/150?u=13", email: "kevin.p@company.com", department_id: 2 },
    { id: 14, name: "Lisa Wang", role: "Content Strategist", avatar: "https://i.pravatar.cc/150?u=14", email: "lisa.w@company.com", department_id: 9 },
    { id: 15, name: "Ryan Cooper", role: "Recruiter", avatar: "https://i.pravatar.cc/150?u=15", email: "ryan.c@company.com", department_id: 8 },
];

const EMPTY_FORM = {
    name: "",
    code: "",
    parent_id: null as number | null,
    manager_id: null as number | null,
    is_active: true,
};

// --- Draggable Employee (DnD) ---
function DraggableEmployee({ employee, deptName, onClick }: { employee: SimpleEmployee; deptName?: string; onClick?: () => void }) {
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
                <p className="text-[11px] text-muted-foreground truncate">{employee.role}{deptName ? ` · ${deptName}` : ''}</p>
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
function DeptDropZone({ children, deptName }: { children: React.ReactNode; deptName: string }) {
    const { isOver, setNodeRef } = useDroppable({ id: "dept-drop-zone" });

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
                    <h4 className="font-bold text-sm">{deptName}</h4>
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

// --- Tree Node Component ---
function DeptTreeNode({
    dept,
    departments,
    employees,
    level,
    expandedIds,
    toggleExpand,
    getManager,
    getEmployeeCount,
    onView,
    onEdit,
    onDelete,
    onAssign,
}: {
    dept: Department;
    departments: Department[];
    employees: SimpleEmployee[];
    level: number;
    expandedIds: Set<number>;
    toggleExpand: (id: number) => void;
    getManager: (id: number | null) => SimpleEmployee | undefined;
    getEmployeeCount: (id: number) => number;
    onView: (d: Department) => void;
    onEdit: (d: Department) => void;
    onDelete: (d: Department) => void;
    onAssign: (d: Department) => void;
}) {
    const children = departments.filter(d => d.parent_id === dept.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(dept.id);
    const manager = getManager(dept.manager_id);
    const empCount = getEmployeeCount(dept.id);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-lg group cursor-pointer",
                    dept.is_active
                        ? "bg-card hover:bg-muted/20 border-border/50 hover:border-primary/30"
                        : "bg-muted/30 hover:bg-muted/50 border-border/30 opacity-70"
                )}
                style={{ marginLeft: level * 28 }}
                onClick={() => onView(dept)}
            >
                {/* Expand/Collapse button */}
                <button
                    className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        hasChildren ? "hover:bg-primary/10 text-muted-foreground hover:text-primary" : "invisible"
                    )}
                    onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(dept.id); }}
                >
                    {hasChildren && (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                </button>

                {/* Icon */}
                <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 border shadow-sm transition-all",
                    dept.is_active
                        ? "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
                        : "bg-muted text-muted-foreground border-border/50"
                )}>
                    {dept.parent_id ? <GitBranch className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>

                {/* Name + Code */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors truncate">{dept.name}</p>
                        <code className="text-[10px] bg-muted/50 px-2 py-0.5 rounded-full border border-border/50 font-mono font-bold text-muted-foreground shrink-0 uppercase tracking-wider">{dept.code}</code>
                    </div>
                    {manager && (
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest truncate mt-0.5 flex items-center gap-1.5">
                            <Users className="w-3 h-3" /> Manager: {manager.name}
                        </p>
                    )}
                </div>

                {/* Employee count */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium">{empCount}</span>
                </div>

                {/* Status */}
                <Badge
                    variant="outline"
                    className={cn(
                        "gap-1 font-semibold text-[10px] shrink-0",
                        dept.is_active
                            ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                            : "text-red-500 bg-red-500/10 border-red-500/20"
                    )}
                >
                    {dept.is_active ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                    {dept.is_active ? "Active" : "Inactive"}
                </Badge>

                {/* Actions */}
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => onView(dept)} className="gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(dept)} className="gap-2 cursor-pointer">
                                <Pencil className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onAssign(dept)} className="gap-2 cursor-pointer">
                                <UserPlus className="w-4 h-4" /> Assign Employees
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(dept)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                                <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </motion.div>

            {/* Children */}
            <AnimatePresence>
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 mt-2"
                    >
                        {children.map(child => (
                            <DeptTreeNode
                                key={child.id}
                                dept={child}
                                departments={departments}
                                employees={employees}
                                level={level + 1}
                                expandedIds={expandedIds}
                                toggleExpand={toggleExpand}
                                getManager={getManager}
                                getEmployeeCount={getEmployeeCount}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAssign={onAssign}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


// --- Main Component ---
// --- Stat Card ---
function StatCard({ label, value, icon: Icon, color, sub, trend }: { label: string; value: string | number; icon: React.ElementType; color: string; sub?: string; trend?: { val: string; isUp: boolean } }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="relative overflow-hidden border hover:shadow-lg transition-shadow group">
                <CardContent className="p-5 flex items-center gap-4">
                    <div className={cn("p-3 rounded-2xl", color)}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                            {trend && (
                                <span className={cn("text-[10px] font-bold flex items-center gap-0.5", trend.isUp ? "text-emerald-500" : "text-rose-500")}>
                                    {trend.isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5 transform rotate-180" />}
                                    {trend.val}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
                        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
                    </div>
                </CardContent>
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", color.replace("/10", "/5"))} />
            </Card>
        </motion.div>
    );
}


export function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
    const [employees, setEmployees] = useState<SimpleEmployee[]>([...ALL_EMPLOYEES]);
    const [searchQuery, setSearchQuery] = useState("");
    const [parentFilter, setParentFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Dialog state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [deletingDept, setDeletingDept] = useState<Department | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);

    // Detail view state
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailDept, setDetailDept] = useState<Department | null>(null);

    // Assignment state
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [assignDept, setAssignDept] = useState<Department | null>(null);
    const [assignSearch, setAssignSearch] = useState("");
    const [activeEmployee, setActiveEmployee] = useState<SimpleEmployee | null>(null);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // Tree expand state
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1, 7]));

    // Stats
    const stats = useMemo(() => ({
        totalDepts: departments.length,
        activeDepts: departments.filter(d => d.is_active).length,
        rootDepts: departments.filter(d => d.parent_id === null).length,
        subDepts: departments.filter(d => d.parent_id !== null).length,
    }), [departments]);

    // Root departments for parent filter
    const rootDeptList = useMemo(() => {
        return departments.filter(d => d.parent_id === null).sort((a, b) => a.name.localeCompare(b.name));
    }, [departments]);

    // Helpers
    const getManager = (managerId: number | null) =>
        managerId ? employees.find(e => e.id === managerId) : undefined;

    const getEmployeeCount = (deptId: number) =>
        employees.filter(e => e.department_id === deptId).length;

    const getParentName = (parentId: number | null) =>
        parentId ? departments.find(d => d.id === parentId)?.name || "—" : "— (Root)";

    const getChildDepts = (deptId: number) =>
        departments.filter(d => d.parent_id === deptId);

    const getDeptEmployees = (deptId: number) =>
        employees.filter(e => e.department_id === deptId);

    // Filter & Sort
    const filtered = useMemo(() => {
        let list = departments.filter(d =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (parentFilter === "root") list = list.filter(d => d.parent_id === null);
        else if (parentFilter !== "all") list = list.filter(d => d.parent_id === Number(parentFilter));
        if (statusFilter !== "all") list = list.filter(d => statusFilter === "active" ? d.is_active : !d.is_active);
        list.sort((a, b) => {
            let cmp = 0;
            if (sortField === "name") cmp = a.name.localeCompare(b.name);
            else if (sortField === "code") cmp = a.code.localeCompare(b.code);
            else if (sortField === "is_active") cmp = Number(b.is_active) - Number(a.is_active);
            return sortDir === "asc" ? cmp : -cmp;
        });
        return list;
    }, [departments, searchQuery, parentFilter, statusFilter, sortField, sortDir]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, parentFilter, statusFilter, sortField, sortDir]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDir("asc"); }
    };

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Form handlers
    const openAdd = () => {
        setEditingDept(null);
        setForm(EMPTY_FORM);
        setIsFormOpen(true);
    };

    const openEdit = (dept: Department) => {
        setEditingDept(dept);
        setForm({
            name: dept.name,
            code: dept.code,
            parent_id: dept.parent_id,
            manager_id: dept.manager_id,
            is_active: dept.is_active,
        });
        setIsFormOpen(true);
    };

    const openDelete = (dept: Department) => {
        setDeletingDept(dept);
        setIsDeleteOpen(true);
    };

    const openDetail = (dept: Department) => {
        setDetailDept(dept);
        setIsDetailOpen(true);
    };

    const openAssign = (dept: Department) => {
        setAssignDept(dept);
        setAssignSearch("");
        setIsAssignOpen(true);
    };

    // Assignment helpers
    const unassignedEmployees = useMemo(() => {
        if (!assignDept) return [];
        return employees.filter(e =>
            e.department_id !== assignDept.id &&
            (e.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
                e.role.toLowerCase().includes(assignSearch.toLowerCase()))
        );
    }, [assignDept, assignSearch, employees]);

    const assignedEmployees = useMemo(() => {
        if (!assignDept) return [];
        return employees.filter(e => e.department_id === assignDept.id);
    }, [assignDept, employees]);

    // DnD handlers
    const handleDragStart = (event: DragStartEvent) => {
        const emp = event.active.data.current?.employee as SimpleEmployee;
        if (emp) setActiveEmployee(emp);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveEmployee(null);
        const { active, over } = event;
        if (!over || !assignDept) return;
        if (over.id === "dept-drop-zone") {
            const emp = active.data.current?.employee as SimpleEmployee;
            if (emp) assignEmployeeToDept(emp.id);
        }
    };

    const assignEmployeeToDept = (empId: number) => {
        if (!assignDept) return;
        setEmployees(prev => prev.map(e =>
            e.id === empId ? { ...e, department_id: assignDept.id } : e
        ));
        const emp = employees.find(e => e.id === empId);
        toast.success(`${emp?.name} assigned to ${assignDept.name}`);
    };

    const unassignEmployeeFromDept = (empId: number) => {
        if (!assignDept) return;
        setEmployees(prev => prev.map(e =>
            e.id === empId ? { ...e, department_id: 0 } : e
        ));
        const emp = employees.find(e => e.id === empId);
        toast.success(`${emp?.name} removed from ${assignDept.name}`);
    };

    const getDeptNameById = (deptId: number) => {
        const d = departments.find(dept => dept.id === deptId);
        return d ? d.name : 'Unassigned';
    };

    const handleSave = () => {
        if (!form.name.trim()) { toast.error("Department name is required"); return; }
        if (!form.code.trim()) { toast.error("Department code is required"); return; }
        const now = new Date().toISOString();
        if (editingDept) {
            setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...form, updated_at: now } : d));
            toast.success(`Department "${form.name}" updated`);
        } else {
            const newDept: Department = {
                ...form, id: Math.max(0, ...departments.map(d => d.id)) + 1,
                created_at: now, updated_at: now,
            };
            setDepartments(prev => [...prev, newDept]);
            toast.success(`Department "${form.name}" created`);
        }
        setIsFormOpen(false);
    };

    const handleDelete = () => {
        if (!deletingDept) return;
        // Check for children
        const children = getChildDepts(deletingDept.id);
        if (children.length > 0) {
            toast.error(`Cannot delete "${deletingDept.name}" — it has ${children.length} sub-department(s)`);
            setIsDeleteOpen(false);
            return;
        }
        setDepartments(prev => prev.filter(d => d.id !== deletingDept.id));
        toast.success(`Department "${deletingDept.name}" deleted`);
        setIsDeleteOpen(false);
        setDeletingDept(null);
    };

    const toggleActive = (dept: Department) => {
        setDepartments(prev => prev.map(d =>
            d.id === dept.id ? { ...d, is_active: !d.is_active, updated_at: new Date().toISOString() } : d
        ));
        toast.success(`Department "${dept.name}" ${dept.is_active ? "deactivated" : "activated"}`);
    };

    // Root departments for tree
    const rootDepartments = useMemo(() =>
        departments.filter(d => d.parent_id === null)
            .filter(d =>
                searchQuery === "" ||
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                departments.some(child =>
                    child.parent_id === d.id &&
                    (child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        child.code.toLowerCase().includes(searchQuery.toLowerCase()))
                )
            ),
        [departments, searchQuery]
    );

    return (
        <div className="space-y-6 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Departments</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Organizational structure and team management
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-muted/40 p-1 rounded-xl border">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-lg", viewMode === "table" && "bg-background shadow-sm")}
                            onClick={() => setViewMode("table")}
                        >
                            <Layers className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-lg", viewMode === "tree" && "bg-background shadow-sm")}
                            onClick={() => setViewMode("tree")}
                        >
                            <FolderTree className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button onClick={openAdd} className="gap-2 gradient-primary shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" /> New Dept
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Depts" value={stats.totalDepts} icon={Building2} color="bg-primary/10 text-primary" sub="Main & Sub units" />
                <StatCard label="Active" value={stats.activeDepts} icon={CheckCircle2} color="bg-emerald-500/10 text-emerald-600" sub={`${Math.round((stats.activeDepts / stats.totalDepts) * 100)}% coverage`} />
                <StatCard label="Root Units" value={stats.rootDepts} icon={Network} color="bg-sky-500/10 text-sky-600" sub="High-level hierarchy" />
                <StatCard label="Sub Units" value={stats.subDepts} icon={GitBranch} color="bg-amber-500/10 text-amber-600" sub="Specialized teams" />
            </div>

            {/* Filters */}
            <Card className="border rounded-2xl">
                <CardContent className="p-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search department..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={parentFilter} onValueChange={setParentFilter}>
                        <SelectTrigger className="w-[170px]"><Filter className="w-4 h-4 mr-2 text-muted-foreground" /><SelectValue placeholder="Parent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="root">Root Only</SelectItem>
                            {rootDeptList.map(d => <SelectItem key={d.id} value={String(d.id)}>Under {d.name}</SelectItem>)}
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

            {/* === TABLE VIEW === */}
            {viewMode === "table" && (
                <Card className="border rounded-2xl overflow-hidden">
                    <CardHeader className="pb-4 px-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Department Records</CardTitle>
                            <CardDescription>Manage organizational units and teams</CardDescription>
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
                                            Department <ArrowUpDown className="w-3.5 h-3.5" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button onClick={() => toggleSort("code")} className="flex items-center gap-1 font-semibold hover:text-primary transition-colors">
                                            Code <ArrowUpDown className="w-3.5 h-3.5" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Parent</TableHead>
                                    <TableHead>Manager</TableHead>
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
                                            <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Building2 className="w-8 h-8 opacity-30" />
                                                    <p>No departments found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((dept, i) => {
                                            const manager = getManager(dept.manager_id);
                                            return (
                                                <motion.tr
                                                    key={dept.id}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="border-b transition-colors hover:bg-muted/50 group cursor-pointer"
                                                    onClick={() => openDetail(dept)}
                                                >
                                                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{dept.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                                dept.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                            )}>
                                                                {dept.parent_id ? <GitBranch className="w-4.5 h-4.5" /> : <Building2 className="w-4.5 h-4.5" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{dept.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Updated {new Date(dept.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <code className="text-xs bg-muted px-2 py-1 rounded-md font-mono">{dept.code}</code>
                                                    </TableCell>
                                                    <TableCell>
                                                        {dept.parent_id ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <FolderTree className="w-3.5 h-3.5 text-muted-foreground" />
                                                                <span className="text-sm">{getParentName(dept.parent_id)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Root</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {manager ? (
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="w-7 h-7 border border-background shadow-sm">
                                                                    <AvatarImage src={manager.avatar} />
                                                                    <AvatarFallback className="text-[10px] font-bold">{manager.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm truncate max-w-[120px]">{manager.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm font-semibold">{getEmployeeCount(dept.id)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "gap-1 font-semibold cursor-pointer transition-colors",
                                                                dept.is_active
                                                                    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                                                                    : "text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                                                            )}
                                                            onClick={(e) => { e.stopPropagation(); toggleActive(dept); }}
                                                        >
                                                            {dept.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                            {dept.is_active ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                                <DropdownMenuItem onClick={() => openDetail(dept)} className="gap-2 cursor-pointer">
                                                                    <Eye className="w-4 h-4" /> View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openEdit(dept)} className="gap-2 cursor-pointer">
                                                                    <Pencil className="w-4 h-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openAssign(dept)} className="gap-2 cursor-pointer">
                                                                    <UserPlus className="w-4 h-4" /> Assign Employees
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openDelete(dept)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                                                                    <Trash2 className="w-4 h-4" /> Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* === TREE VIEW === */}
            {viewMode === "tree" && (
                <Card className="rounded-3xl border shadow-sm">
                    <CardContent className="p-6 space-y-3">
                        {rootDepartments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Building2 className="w-10 h-10 opacity-30 mb-3" />
                                <p className="font-medium">No departments found</p>
                            </div>
                        ) : (
                            rootDepartments.map(dept => (
                                <DeptTreeNode
                                    key={dept.id}
                                    dept={dept}
                                    departments={departments}
                                    employees={employees}
                                    level={0}
                                    expandedIds={expandedIds}
                                    toggleExpand={toggleExpand}
                                    getManager={getManager}
                                    getEmployeeCount={getEmployeeCount}
                                    onView={openDetail}
                                    onEdit={openEdit}
                                    onDelete={openDelete}
                                    onAssign={openAssign}
                                />
                            ))
                        )}
                    </CardContent>
                </Card>
            )}

            {/* === ADD / EDIT DIALOG === */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[520px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{editingDept ? "Edit Department" : "Add New Department"}</DialogTitle>
                        <DialogDescription>
                            {editingDept ? "Update the department information below." : "Fill in the details for the new department."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="dept_name" className="font-semibold">Department Name *</Label>
                            <Input id="dept_name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="dept_code" className="font-semibold">Code *</Label>
                                <Input id="dept_code" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. ENG" className="rounded-xl font-mono" maxLength={20} />
                            </div>
                            <div className="grid gap-2">
                                <Label className="font-semibold">Parent Department</Label>
                                <Select
                                    value={form.parent_id?.toString() || "none"}
                                    onValueChange={val => setForm(f => ({ ...f, parent_id: val === "none" ? null : Number(val) }))}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select parent..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="none">— None (Root)</SelectItem>
                                        {departments
                                            .filter(d => d.id !== editingDept?.id)
                                            .map(d => (
                                                <SelectItem key={d.id} value={d.id.toString()}>
                                                    {d.name} ({d.code})
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="font-semibold">Manager</Label>
                            <Select
                                value={form.manager_id?.toString() || "none"}
                                onValueChange={val => setForm(f => ({ ...f, manager_id: val === "none" ? null : Number(val) }))}
                            >
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Select manager..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="none">— Unassigned</SelectItem>
                                    {employees.map(e => (
                                        <SelectItem key={e.id} value={e.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <span>{e.name}</span>
                                                <span className="text-muted-foreground text-xs">· {e.role}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                            <div>
                                <Label htmlFor="is_active" className="font-semibold">Active Status</Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Enable or disable this department</p>
                            </div>
                            <Switch id="is_active" checked={form.is_active} onCheckedChange={checked => setForm(f => ({ ...f, is_active: checked }))} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleSave} className="gradient-primary rounded-xl shadow-lg shadow-primary/20 px-6">
                            {editingDept ? "Save Changes" : "Create Department"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* === DELETE CONFIRMATION === */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-destructive">Delete Department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong className="text-foreground">{deletingDept?.name}</strong>?
                            {getChildDepts(deletingDept?.id || 0).length > 0 && (
                                <span className="block mt-2 text-amber-600 font-medium">
                                    ⚠️ This department has {getChildDepts(deletingDept?.id || 0).length} sub-department(s).
                                    It cannot be deleted until sub-departments are moved or removed.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} className="rounded-xl px-6">Delete Department</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* === DETAIL VIEW DIALOG === */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[650px] max-h-[85vh] rounded-2xl p-0 gap-0 overflow-hidden">
                    {detailDept && (() => {
                        const manager = getManager(detailDept.manager_id);
                        const deptEmployees = getDeptEmployees(detailDept.id);
                        const children = getChildDepts(detailDept.id);
                        const parent = detailDept.parent_id ? departments.find(d => d.id === detailDept.parent_id) : null;

                        return (
                            <>
                                {/* Header */}
                                <div className="p-6 pb-4 border-b bg-muted/5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center",
                                                detailDept.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                            )}>
                                                <Building2 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-bold">{detailDept.name}</h3>
                                                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">{detailDept.code}</code>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "gap-1 font-semibold text-xs",
                                                            detailDept.is_active
                                                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                                                                : "text-red-500 bg-red-500/10 border-red-500/20"
                                                        )}
                                                    >
                                                        {detailDept.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        {detailDept.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                    {parent && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <FolderTree className="w-3 h-3" /> {parent.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => { setIsDetailOpen(false); openAssign(detailDept); }}>
                                                <UserPlus className="w-3.5 h-3.5" /> Assign
                                            </Button>
                                            <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={() => { setIsDetailOpen(false); openEdit(detailDept); }}>
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department ID</p>
                                            <p className="text-sm font-bold mt-1 font-mono">{detailDept.id}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Created</p>
                                            <p className="text-sm font-bold mt-1">
                                                {new Date(detailDept.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Manager */}
                                    {manager && (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
                                            <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
                                                <AvatarImage src={manager.avatar} />
                                                <AvatarFallback className="text-xs font-bold">{manager.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Department Manager</p>
                                                <p className="text-sm font-bold">{manager.name}</p>
                                                <p className="text-xs text-muted-foreground">{manager.role}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-departments */}
                                    {children.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                                <GitBranch className="w-3.5 h-3.5" /> Sub-Departments ({children.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {children.map(child => (
                                                    <div
                                                        key={child.id}
                                                        className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                                                        onClick={() => { setDetailDept(child); }}
                                                    >
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-lg flex items-center justify-center",
                                                            child.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                        )}>
                                                            <GitBranch className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">{child.name}</p>
                                                            <p className="text-[11px] text-muted-foreground">{child.code} · {getEmployeeCount(child.id)} employees</p>
                                                        </div>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[10px]",
                                                            child.is_active ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"
                                                        )}>
                                                            {child.is_active ? "Active" : "Inactive"}
                                                        </Badge>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Employees */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5" /> Team Members ({deptEmployees.length})
                                        </h4>
                                        {deptEmployees.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                                <Users className="w-8 h-8 opacity-20 mb-2" />
                                                <p className="text-sm">No employees in this department</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {deptEmployees.map(emp => (
                                                    <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                                                        <Avatar className="w-9 h-9 border-2 border-background shadow-sm shrink-0">
                                                            <AvatarImage src={emp.avatar} />
                                                            <AvatarFallback className="text-xs font-bold">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">{emp.name}</p>
                                                            <p className="text-[11px] text-muted-foreground truncate">{emp.role} · {emp.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* === ASSIGN EMPLOYEES DIALOG (DnD) === */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[85vh] rounded-2xl p-0 gap-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Assign Employees
                        </DialogTitle>
                        <DialogDescription>
                            Drag employees from the left panel to assign them to <strong className="text-foreground">{assignDept?.name}</strong>, or click the <UserPlus className="w-3.5 h-3.5 inline" /> button.
                        </DialogDescription>
                    </DialogHeader>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex h-[55vh]">
                            {/* Left: Unassigned / other-department employees */}
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
                                        {unassignedEmployees.length} available employee{unassignedEmployees.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    <AnimatePresence>
                                        {unassignedEmployees.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                                                <Users className="w-8 h-8 opacity-30 mb-2" />
                                                <p className="text-sm">No available employees</p>
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
                                                        deptName={getDeptNameById(emp.department_id)}
                                                        onClick={() => assignEmployeeToDept(emp.id)}
                                                    />
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right: Department assigned employees */}
                            <div className="flex-1 flex flex-col p-4">
                                <DeptDropZone deptName={assignDept?.name || ""}>
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
                                                    className="flex items-center gap-3 p-4 rounded-2xl border bg-card hover:bg-muted/20 transition-all group shadow-sm hover:shadow-md border-border/50 hover:border-primary/20"
                                                >
                                                    <Avatar className="w-10 h-10 border shadow-sm shrink-0">
                                                        <AvatarImage src={emp.avatar} />
                                                        <AvatarFallback className="text-xs font-bold">{emp.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{emp.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">{emp.role} · {emp.email}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive border border-border/50"
                                                        onClick={() => unassignEmployeeFromDept(emp.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </DeptDropZone>
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
        </div>
    );
}
