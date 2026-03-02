import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DollarSign, Receipt, CreditCard, Banknote,
    Search, Download, TrendingUp, History,
    MoreVertical, CheckCircle2, AlertCircle, Calendar,
    ArrowRight, ShieldCheck, PieChart as PieIcon, Timer,
    ChevronLeft, ChevronRight, Plus as Plus,
} from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PayrollRecord {
    id: number;
    period: string;
    total_payout: number;
    employees_count: number;
    status: "processed" | "pending" | "processing";
    payment_date: string;
}

const MOCK_PAYROLLS: PayrollRecord[] = [
    { id: 1, period: "Feb 2026", total_payout: 452000000, employees_count: 248, status: "pending", payment_date: "2026-02-28" },
    { id: 2, period: "Jan 2026", total_payout: 448500000, employees_count: 245, status: "processed", payment_date: "2026-01-31" },
    { id: 3, period: "Dec 2025", total_payout: 512000000, employees_count: 242, status: "processed", payment_date: "2025-12-31" },
    { id: 4, period: "Nov 2025", total_payout: 442000000, employees_count: 240, status: "processed", payment_date: "2025-11-30" },
];

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

export function PayrollPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const filtered = useMemo(() => {
        return MOCK_PAYROLLS.filter(p => p.period.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="space-y-6 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Payroll</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Manage employee compensation, tax, and benefits
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => toast.success("Opening reports...")}>
                        <PieIcon className="w-4 h-4" /> Reports
                    </Button>
                    <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20">
                        <Banknote className="w-4 h-4" /> Run Payroll
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Payout"
                    value={formatCurrency(452000000)}
                    icon={Banknote}
                    color="bg-primary/10 text-primary"
                    sub="Next cycle (Feb 28)"
                    trend={{ val: "1.2%", isUp: true }}
                />
                <StatCard
                    label="Avg / Employee"
                    value={formatCurrency(1822000)}
                    icon={CreditCard}
                    color="bg-sky-500/10 text-sky-600"
                    sub="Based on last cycle"
                />
                <StatCard
                    label="Tax Liablity"
                    value={formatCurrency(48500000)}
                    icon={ShieldCheck}
                    color="bg-emerald-500/10 text-emerald-600"
                    sub="Fully compliant"
                />
                <StatCard
                    label="Active Employees"
                    value="248"
                    icon={Receipt}
                    color="bg-amber-500/10 text-amber-600"
                    sub="On current payroll"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payroll History */}
                <Card className="lg:col-span-2 border rounded-3xl overflow-hidden shadow-sm">
                    <CardHeader className="bg-muted/10 border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Payroll History</CardTitle>
                                <CardDescription>Recent salary processing status</CardDescription>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search period..."
                                    className="pl-9 h-9 text-xs rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/10 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Period</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Total Payout</th>
                                        <th className="px-6 py-4">Employees</th>
                                        <th className="px-6 py-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginatedData.map((p, i) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="group hover:bg-muted/20 transition-all cursor-pointer border-b last:border-0"
                                        >
                                            <td className="px-6 py-5 font-bold text-sm group-hover:text-primary transition-colors">{p.period}</td>
                                            <td className="px-6 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize",
                                                    p.status === "processed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                        p.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                            "bg-sky-500/10 text-sky-600 border-sky-500/20"
                                                )}>
                                                    {p.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-mono font-bold text-sm tracking-tighter">
                                                {formatCurrency(p.total_payout)}
                                            </td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-muted-foreground">{p.employees_count} Members</td>
                                            <td className="px-6 py-5 text-right pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/50 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:text-primary">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 border-t px-8 py-5">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rows:</span>
                                    <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                                        <SelectTrigger className="w-[60px] h-8 text-xs bg-muted/40 border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 20, 50].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-[11px] text-muted-foreground font-medium ml-2">
                                        Showing {Math.min(filtered.length, (currentPage - 1) * pageSize + 1)}-{Math.min(filtered.length, currentPage * pageSize)} of {filtered.length}
                                    </span>
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
                        )}
                    </CardContent>
                </Card>

                {/* Payment Methods & Tools */}
                <div className="space-y-6">
                    <Card className="rounded-3xl border shadow-sm flex flex-col h-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-3 hover:bg-muted/60 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><CreditCard className="w-3.5 h-3.5" /> Direct Deposit</p>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">BCA Corporate Account</h4>
                                    <p className="text-[10px] text-muted-foreground font-mono">**** **** 9203</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest px-1">Quick Tools</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <QuickToolButton icon={Receipt} label="Bulk Slip" />
                                    <QuickToolButton icon={History} label="Audit Log" />
                                    <QuickToolButton icon={Download} label="Bank Feed" />
                                    <QuickToolButton icon={AlertCircle} label="Tax Docs" />
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Timer className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-primary uppercase">Next Cut-off</p>
                                        <p className="text-sm font-bold text-foreground">Feb 25, 2026</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function QuickToolButton({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <button className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 hover:bg-primary/5 hover:text-primary border border-transparent hover:border-primary/20 transition-all gap-2 group">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </button>
    );
}


