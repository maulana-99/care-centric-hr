import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import {
    Plus,
    GripVertical,
    Calendar as CalendarIcon,
    Clock,
    Users,
    MoreVertical,
    Edit,
    Trash2,
    CalendarDays,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Employee {
    id: string;
    name: string;
    role: string;
    avatar: string;
    shiftId: string;
    effective_from?: string;
    effective_to?: string;
}

interface ShiftSchedule {
    day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
    start_time: string;
    end_time: string;
    is_working_day: boolean;
}

interface Shift {
    id: string;
    name: string; // was title
    code: string;
    description: string;
    is_active: boolean;
    schedules: ShiftSchedule[];
    color: string; // Keep for UI styling
}

interface HistoryLog {
    id: number;
    action: string;
    details: string;
    timestamp: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
    { id: "1", name: "Sarah Anderson", role: "HR Manager", avatar: "https://i.pravatar.cc/150?u=1", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "2", name: "John Doe", role: "Developer", avatar: "https://i.pravatar.cc/150?u=2", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "3", name: "Emily Wilson", role: "Designer", avatar: "https://i.pravatar.cc/150?u=3", shiftId: "afternoon", effective_from: "2026-02-01" },
    { id: "4", name: "Michael Brown", role: "Product Manager", avatar: "https://i.pravatar.cc/150?u=4", shiftId: "night", effective_from: "2026-02-01" },
    { id: "5", name: "Jessica Lee", role: "Support", avatar: "https://i.pravatar.cc/150?u=5", shiftId: "unassigned" },
    { id: "6", name: "David Miller", role: "Security", avatar: "https://i.pravatar.cc/150?u=6", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "7", name: "Sophia Taylor", role: "QA Engineer", avatar: "https://i.pravatar.cc/150?u=7", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "8", name: "James Wilson", role: "Frontend Dev", avatar: "https://i.pravatar.cc/150?u=8", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "9", name: "Olivia Davis", role: "Backend Dev", avatar: "https://i.pravatar.cc/150?u=9", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "10", name: "Daniel Martinez", role: "DevOps", avatar: "https://i.pravatar.cc/150?u=10", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "11", name: "Isabella Garcia", role: "Product Owner", avatar: "https://i.pravatar.cc/150?u=11", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "12", name: "William Rodriguez", role: "Scrum Master", avatar: "https://i.pravatar.cc/150?u=12", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "13", name: "Mia Hernandez", role: "UX Researcher", avatar: "https://i.pravatar.cc/150?u=13", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "14", name: "Alexander Lopez", role: "Data Analyst", avatar: "https://i.pravatar.cc/150?u=14", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "15", name: "Charlotte Gonzalez", role: "Marketing", avatar: "https://i.pravatar.cc/150?u=15", shiftId: "morning", effective_from: "2026-02-01" },
    { id: "16", name: "Benjamin Perez", role: "Sales", avatar: "https://i.pravatar.cc/150?u=16", shiftId: "afternoon", effective_from: "2026-02-01" },
    { id: "17", name: "Amelia Sanchez", role: "Customer Success", avatar: "https://i.pravatar.cc/150?u=17", shiftId: "afternoon", effective_from: "2026-02-01" },
    { id: "18", name: "Ethan Rivera", role: "Account Manager", avatar: "https://i.pravatar.cc/150?u=18", shiftId: "afternoon", effective_from: "2026-02-01" },
    { id: "19", name: "Harper Campbell", role: "Content Writer", avatar: "https://i.pravatar.cc/150?u=19", shiftId: "night", effective_from: "2026-02-01" },
    { id: "20", name: "Lucas Mitchell", role: "SEO Specialist", avatar: "https://i.pravatar.cc/150?u=20", shiftId: "night", effective_from: "2026-02-01" },
];

const DEFAULT_SCHEDULES: ShiftSchedule[] = Array.from({ length: 7 }, (_, i) => ({
    day_of_week: i, // 0-6
    start_time: "09:00",
    end_time: "17:00",
    is_working_day: i > 0 && i < 6, // Mon-Fri default
}));

const INITIAL_SHIFTS: Shift[] = [
    {
        id: "morning",
        name: "Morning Shift",
        code: "MORN",
        description: "Standard morning operation hours",
        is_active: true,
        color: "bg-blue-500/10 text-blue-600 border-blue-200",
        schedules: DEFAULT_SCHEDULES.map(s => ({ ...s, start_time: "06:00", end_time: "14:00" }))
    },
    {
        id: "afternoon",
        name: "Afternoon Shift",
        code: "AFT",
        description: "Mid-day to evening shift",
        is_active: true,
        color: "bg-orange-500/10 text-orange-600 border-orange-200",
        schedules: DEFAULT_SCHEDULES.map(s => ({ ...s, start_time: "14:00", end_time: "22:00" }))
    },
    {
        id: "night",
        name: "Night Shift",
        code: "NGT",
        description: "Overnight facility maintenance and operation",
        is_active: true,
        color: "bg-purple-500/10 text-purple-600 border-purple-200",
        schedules: DEFAULT_SCHEDULES.map(s => ({ ...s, start_time: "22:00", end_time: "06:00" }))
    },
    {
        id: "early_morning",
        name: "Early Morning",
        code: "EM",
        description: "Pre-opening preparation crew",
        is_active: true,
        color: "bg-amber-500/10 text-amber-600 border-amber-200",
        schedules: DEFAULT_SCHEDULES.map(s => ({ ...s, start_time: "04:00", end_time: "12:00" }))
    },
    {
        id: "evening_rush",
        name: "Evening Rush",
        code: "EVR",
        description: "Peak hours support team",
        is_active: true,
        color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
        schedules: DEFAULT_SCHEDULES.map(s => ({ ...s, start_time: "16:00", end_time: "00:00" }))
    },
    {
        id: "unassigned",
        name: "Unassigned",
        code: "NA",
        description: "Employees waiting for assignment",
        is_active: true,
        color: "bg-slate-500/10 text-slate-600 border-slate-200",
        schedules: []
    },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function EmployeeHoverCard({
    employee,
    position
}: {
    employee: Employee | null;
    position: { x: number; y: number }
}) {
    if (!employee) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
                position: 'fixed',
                left: typeof window !== 'undefined' ? Math.min(position.x + 20, window.innerWidth - 248) : position.x + 20,
                top: typeof window !== 'undefined' ? Math.min(position.y + 20, window.innerHeight - 180) : position.y + 20,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
            className="w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 space-y-4"
        >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Validity Period</span>
                    <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">{employee.name}</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Effective From</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {employee.effective_from || "2026-02-01"}
                    </span>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">Effective To</span>
                    </div>
                    <span className={cn(
                        "text-xs font-mono font-bold px-2 py-0.5 rounded-md",
                        employee.effective_to
                            ? "text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
                            : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    )}>
                        {employee.effective_to || "Ongoing"}
                    </span>
                </div>
            </div>

            <div className="pt-1 text-[9px] text-center text-slate-400 font-medium italic">
                Refreshed for February cycle
            </div>
        </motion.div>
    );
}

function SortableEmployeeCard({
    employee,
    isDragging,
    onEdit,
    onHover,
    onHoverEnd
}: {
    employee: Employee;
    isDragging?: boolean;
    onEdit?: (employee: Employee) => void;
    onHover?: (e: React.MouseEvent, employee: Employee) => void;
    onHoverEnd?: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: employee.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative flex items-center gap-3 p-3 mb-2 bg-card border rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 border-primary shadow-lg ring-2 ring-primary/20"
            )}
            onMouseMove={(e) => onHover?.(e, employee)}
            onMouseLeave={() => onHoverEnd?.()}
        >
            <div {...attributes} {...listeners} className="text-muted-foreground/30 group-hover:text-primary transition-colors">
                <GripVertical className="w-4 h-4" />
            </div>
            <Avatar className="w-8 h-8 ring-2 ring-background">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{employee.name}</p>
                <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">{employee.role}</p>
                    {employee.effective_from && employee.shiftId !== 'unassigned' && (
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 font-normal bg-primary/5 text-primary/70 border-primary/20">
                            Eff. {employee.effective_from}
                        </Badge>
                    )}
                </div>
            </div>
            {onEdit && employee.shiftId !== 'unassigned' && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(employee);
                    }}
                >
                    <Edit className="w-3.5 h-3.5" />
                </Button>
            )}
        </div>
    );
}

export function ShiftPage() {
    const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
    const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryLog[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [hoverInfo, setHoverInfo] = useState<{ employee: Employee, x: number, y: number } | null>(null);

    // Dialog & Form State
    const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        isActive: true,
        schedules: DEFAULT_SCHEDULES
    });

    const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [assignmentData, setAssignmentData] = useState({
        effective_from: "",
        effective_to: ""
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(String(event.active.id));
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) return;

        const activeEmployee = employees.find((e) => e.id === activeId);
        if (!activeEmployee) return;

        const isOverContainer = shifts.some((s) => s.id === overId);

        if (isOverContainer) {
            if (activeEmployee.shiftId !== overId) {
                setEmployees((prev) =>
                    prev.map((e) => (e.id === activeId ? { ...e, shiftId: String(overId) } : e))
                );
            }
            return;
        }

        const overEmployee = employees.find((e) => e.id === overId);
        if (overEmployee && activeEmployee.shiftId !== overEmployee.shiftId) {
            setEmployees((prev) =>
                prev.map((e) => (e.id === activeId ? { ...e, shiftId: overEmployee.shiftId } : e))
            );
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            setEmployees((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });

            const overId = String(over.id);
            let targetShift = shifts.find(s => s.id === overId);
            if (!targetShift) {
                const overEmployee = employees.find(e => e.id === overId);
                if (overEmployee) {
                    targetShift = shifts.find(s => s.id === overEmployee.shiftId);
                }
            }

            // Logic: Assignment implies Effective Date = Today (Logic 3 from SHIFT_SYSTEM.md)
            if (targetShift && targetShift.id !== 'unassigned') {
                const today = new Date().toISOString().split('T')[0];
                setEmployees(prev => prev.map(e => e.id === active.id ? { ...e, effective_from: today } : e));

                toast.success(`Employee assigned to ${targetShift.name}`, {
                    description: `Effective from today (${today})`
                });
                setHistory(prev => [...prev, {
                    id: Date.now(),
                    action: "Assignment",
                    details: `Moved employee to ${targetShift.name}`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else if (targetShift && targetShift.id === 'unassigned') {
                toast.info("Employee moved to Unassigned");
                setHistory(prev => [...prev, {
                    id: Date.now(),
                    action: "Unassigned",
                    details: `Moved employee to Waitlist`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            }
        }
    }


    const handleOpenCreateDialog = () => {
        setEditingShiftId(null);
        setFormData({
            name: "",
            code: "",
            description: "",
            isActive: true,
            schedules: DEFAULT_SCHEDULES
        });
        setIsShiftDialogOpen(true);
    };

    const handleEditShift = (shift: Shift) => {
        setEditingShiftId(shift.id);
        setFormData({
            name: shift.name,
            code: shift.code,
            description: shift.description,
            isActive: shift.is_active,
            schedules: shift.schedules
        });
        setIsShiftDialogOpen(true);
    };

    const handleSaveShift = () => {
        if (!formData.name) {
            toast.error("Shift Name is required");
            return;
        }

        // Logic from SHIFT_SYSTEM.md: Auto-generate code if empty
        let shiftCode = formData.code;
        if (!shiftCode) {
            const nextId = shifts.length + 1;
            shiftCode = `SH-${String(nextId).padStart(3, '0')}`;
        }

        // Simulating Backend Validation: Code must be unique
        const isCodeDuplicate = shifts.some(s => s.code === shiftCode && s.id !== editingShiftId);
        if (isCodeDuplicate) {
            toast.error(`Shift Code '${shiftCode}' already exists. Please use a unique code.`);
            return;
        }

        if (editingShiftId) {
            // Update existing
            setShifts(shifts.map(s => s.id === editingShiftId ? {
                ...s,
                is_active: formData.isActive,
                schedules: formData.schedules,
            } : s));
            toast.success("Shift updated successfully");
            setHistory(prev => [...prev, {
                id: Date.now(),
                action: "Update Shift",
                details: `Updated configuration for ${formData.name}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } else {
            // Create new
            const id = formData.name.toLowerCase().replace(/\s+/g, '-');
            const newShift: Shift = {
                id,
                name: formData.name,
                code: shiftCode,
                description: formData.description,
                is_active: formData.isActive,
                schedules: formData.schedules,
                color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
            };
            setShifts([...shifts, newShift]);
            toast.success(`New shift created with code: ${shiftCode}`);
            setHistory(prev => [...prev, {
                id: Date.now(),
                action: "Create Shift",
                details: `Created new shift: ${formData.name} (${shiftCode})`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        }
        setIsShiftDialogOpen(false);
    };

    const handleScheduleChange = (index: number, field: keyof ShiftSchedule, value: string | boolean) => {
        const updated = [...formData.schedules];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, schedules: updated });
    };
    const handleDeleteShift = (id: string) => {
        if (id === 'unassigned') return;
        setShifts(shifts.filter(s => s.id !== id));
        setEmployees(employees.map(e => e.shiftId === id ? { ...e, shiftId: 'unassigned' } : e));
        toast.success("Shift removed");
        setHistory(prev => [...prev, {
            id: Date.now(),
            action: "Delete Shift",
            details: `Removed shift definition (ID: ${id})`,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const getShiftTimeDisplay = (shift: Shift) => {
        if (shift.id === 'unassigned') return 'Waitlist';
        // Check if all working days have same time
        const workingDays = shift.schedules.filter(s => s.is_working_day);
        if (workingDays.length === 0) return 'No workings days';

        const first = workingDays[0];
        const isUniform = workingDays.every(s => s.start_time === first.start_time && s.end_time === first.end_time);

        if (isUniform) {
            return `${first.start_time} - ${first.end_time}`;
        }
        return 'Varied Schedule';
    };

    const handleOpenAssignmentEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setAssignmentData({
            effective_from: employee.effective_from || new Date().toISOString().split('T')[0],
            effective_to: employee.effective_to || ""
        });
        setIsAssignmentDialogOpen(true);
    };

    const handleSaveAssignment = () => {
        if (!editingEmployee) return;

        setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? {
            ...e,
            effective_from: assignmentData.effective_from,
            effective_to: assignmentData.effective_to || undefined
        } : e));

        toast.success("Assignment dates updated");
        setIsAssignmentDialogOpen(false);
        setEditingEmployee(null);
    };



    const activeEmployee = activeId ? employees.find(e => e.id === activeId) : null;
    const filteredEmployees = employees;

    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Shift Management</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Workspace Scheduling for February 2026
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsHistoryOpen(true)} className="gap-2">
                        <Users className="w-4 h-4" />
                        Operational Status
                        {history.length > 0 && (
                            <span className="flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </span>
                        )}
                    </Button>
                    <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleOpenCreateDialog} className="bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 px-6">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Shift
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingShiftId ? "Edit Shift Definition" : "Add New Shift Definition"}</DialogTitle>
                                <DialogDescription>
                                    {editingShiftId ? "Modify existing shift properties and schedule." : "Define shift properties and weekly schedule."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Shift Name *</Label>
                                        <Input id="name" placeholder="e.g. Standard Morning" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Shift Code</Label>
                                        <Input
                                            id="code"
                                            placeholder="Auto-generated (e.g. SH-001)"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        />
                                        <p className="text-[10px] text-muted-foreground">Leave empty to auto-generate</p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Input id="desc" placeholder="Brief description of the shift" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="active" checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                                    <Label htmlFor="active">Is Active?</Label>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Weekly Schedule Config</Label>
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="grid grid-cols-12 bg-muted/50 p-2 text-xs font-medium text-muted-foreground">
                                            <div className="col-span-3">Day</div>
                                            <div className="col-span-2 text-center">Work Day</div>
                                            <div className="col-span-7 grid grid-cols-2 gap-2 text-center">
                                                <span>Start Time</span>
                                                <span>End Time</span>
                                            </div>
                                        </div>
                                        {formData.schedules.map((schedule, idx) => (
                                            <div key={schedule.day_of_week} className={cn("grid grid-cols-12 p-3 items-center border-t text-sm", !schedule.is_working_day && "opacity-50 bg-muted/20")}>
                                                <div className="col-span-3 font-medium">{DAYS[schedule.day_of_week]}</div>
                                                <div className="col-span-2 flex justify-center">
                                                    <Switch
                                                        checked={schedule.is_working_day}
                                                        onCheckedChange={(checked) => handleScheduleChange(idx, 'is_working_day', checked)}
                                                    />
                                                </div>
                                                <div className="col-span-7 grid grid-cols-2 gap-2">
                                                    <Input
                                                        type="time"
                                                        className="h-8"
                                                        value={schedule.start_time}
                                                        disabled={!schedule.is_working_day}
                                                        onChange={(e) => handleScheduleChange(idx, 'start_time', e.target.value)}
                                                    />
                                                    <Input
                                                        type="time"
                                                        className="h-8"
                                                        value={schedule.end_time}
                                                        disabled={!schedule.is_working_day}
                                                        onChange={(e) => handleScheduleChange(idx, 'end_time', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsShiftDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveShift}>{editingShiftId ? "Save Changes" : "Create Shift"}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col xl:flex-row items-start gap-8">
                    {/* Active Shifts Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                        {shifts.filter(s => s.id !== 'unassigned').map((shift) => (
                            <Card key={shift.id} className="bg-muted/20 border-2 border-dashed border-muted flex flex-col h-[600px] rounded-3xl overflow-hidden transition-all hover:border-primary/20">
                                <CardHeader className="p-5 pb-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <Badge variant="outline" className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full", shift.color)}>
                                            {shift.name} {shift.code && <span className="opacity-70 ml-1">({shift.code})</span>}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => handleEditShift(shift)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Shift
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    disabled={shift.id === 'unassigned'}
                                                    onClick={() => handleDeleteShift(shift.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Shift
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="space-y-1.5 px-1">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                            {getShiftTimeDisplay(shift)}
                                        </div>
                                        <CardDescription className="text-[11px] leading-relaxed line-clamp-1">
                                            {shift.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col">
                                    <div className="bg-background/40 rounded-2xl p-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 min-h-[300px]">
                                        <SortableContext
                                            id={shift.id}
                                            items={filteredEmployees.filter(e => e.shiftId === shift.id).map(e => e.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {filteredEmployees
                                                        .filter((e) => e.shiftId === shift.id)
                                                        .map((employee) => (
                                                            <motion.div
                                                                key={employee.id}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                layout
                                                            >
                                                                <SortableEmployeeCard
                                                                    employee={employee}
                                                                    onEdit={handleOpenAssignmentEdit}
                                                                    onHover={(e, emp) => setHoverInfo({ employee: emp, x: e.clientX, y: e.clientY })}
                                                                    onHoverEnd={() => setHoverInfo(null)}
                                                                />
                                                            </motion.div>
                                                        ))}
                                                </AnimatePresence>
                                            </div>
                                        </SortableContext>
                                    </div>
                                </CardContent>

                                <div className="p-4 bg-muted/30 border-t border-dashed flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3 h-3 text-primary" />
                                        {filteredEmployees.filter(e => e.shiftId === shift.id).length} Personnel
                                    </span>
                                    <span className={cn("flex items-center gap-1", shift.is_active ? "text-emerald-500" : "text-muted-foreground")}>
                                        <CheckCircle2 className="w-3 h-3" />
                                        {shift.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Sticky Unassigned Sidebar for Better UX */}
                    {shifts.filter(s => s.id === 'unassigned').map((shift) => (
                        <div key={shift.id} className="xl:sticky xl:top-6 w-full xl:w-96 shrink-0">
                            <Card className="bg-muted/10 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-sm">
                                <CardHeader className="p-5 bg-background/50 border-b border-dashed">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                <Users className="w-5 h-5 text-slate-500" />
                                                Employee Pool
                                            </CardTitle>
                                            <CardDescription>
                                                Staff waiting for shift assignment
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="text-xs font-mono">
                                            {filteredEmployees.filter(e => e.shiftId === shift.id).length} / {employees.length}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 p-3 overflow-hidden flex flex-col">
                                    <div className="bg-background/40 rounded-2xl p-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
                                        <SortableContext
                                            id={shift.id}
                                            items={filteredEmployees.filter(e => e.shiftId === shift.id).map(e => e.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="space-y-3 p-1">
                                                {filteredEmployees.filter(e => e.shiftId === shift.id).length === 0 && (
                                                    <div className="h-32 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl m-2">
                                                        <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                                                        <p className="text-xs font-medium opacity-50">All staff assigned</p>
                                                    </div>
                                                )}
                                                <AnimatePresence>
                                                    {filteredEmployees
                                                        .filter((e) => e.shiftId === shift.id)
                                                        .map((employee) => (
                                                            <motion.div
                                                                key={employee.id}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                layout
                                                            >
                                                                <SortableEmployeeCard
                                                                    employee={employee}
                                                                    onHover={(e, emp) => setHoverInfo({ employee: emp, x: e.clientX, y: e.clientY })}
                                                                    onHoverEnd={() => setHoverInfo(null)}
                                                                />
                                                            </motion.div>
                                                        ))}
                                                </AnimatePresence>
                                            </div>
                                        </SortableContext>
                                    </div>
                                </CardContent>
                                <div className="p-3 bg-muted/20 border-t text-xs text-center text-muted-foreground">
                                    Drag staff here to unassign them from shifts
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: "0.5",
                            },
                        },
                    }),
                }}>
                    {activeEmployee ? (
                        <div className="flex items-center gap-3 p-4 bg-card border-2 border-primary rounded-2xl shadow-2xl w-72 scale-105 transition-transform">
                            <GripVertical className="w-4 h-4 text-primary opacity-50" />
                            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                                <AvatarImage src={activeEmployee.avatar} />
                                <AvatarFallback>{activeEmployee.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-primary">{activeEmployee.name}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter truncate">{activeEmployee.role}</p>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>

                <AnimatePresence>
                    {hoverInfo && !activeId && (
                        <EmployeeHoverCard
                            employee={hoverInfo.employee}
                            position={{ x: hoverInfo.x, y: hoverInfo.y }}
                        />
                    )}
                </AnimatePresence>
            </DndContext>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Operational Status</DialogTitle>
                        <DialogDescription>
                            Current capacity overview and session history.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Capacity Overview</p>
                            <p className="text-xs text-muted-foreground">Managing {shifts.length} shift groups and {employees.length} employees</p>
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-3 py-2 border-t pt-4">
                        <Label>Session History</Label>
                        {history.length === 0 ? (
                            <p className="text-xs text-center text-muted-foreground py-4">No actions recorded yet.</p>
                        ) : (
                            history.slice().reverse().map((log) => (
                                <div key={log.id} className="flex flex-col border-b pb-2 last:border-0">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-xs">{log.action}</span>
                                        <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{log.details}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            className="w-full sm:w-auto"
                            onClick={() => {
                                toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
                                    loading: 'Saving to database...',
                                    success: () => {
                                        setHistory([]); // Clear logs on save
                                        return "All changes saved successfully";
                                    },
                                    error: 'Failed to save',
                                });
                                setIsHistoryOpen(false);
                            }}
                        >
                            Save Changes {history.length > 0 && `(${history.length})`}
                        </Button>
                        <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Shift Assignment</DialogTitle>
                        <DialogDescription>
                            Set the effective dates for {editingEmployee?.name}'s assignment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="eff_from">Effective From *</Label>
                            <Input
                                id="eff_from"
                                type="date"
                                value={assignmentData.effective_from}
                                onChange={(e) => setAssignmentData({ ...assignmentData, effective_from: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="eff_to">Effective To (Optional)</Label>
                            <Input
                                id="eff_to"
                                type="date"
                                value={assignmentData.effective_to}
                                onChange={(e) => setAssignmentData({ ...assignmentData, effective_to: e.target.value })}
                            />
                            <p className="text-[10px] text-muted-foreground">Leave empty if assignment is ongoing.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveAssignment}>Save Assignment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
