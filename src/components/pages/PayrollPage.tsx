import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DollarSign, Receipt, CreditCard, Banknote,
    Search, Download, TrendingUp, History,
    MoreVertical, CheckCircle2, AlertCircle, Calendar,
    ArrowRight, ShieldCheck, PieChart as PieIcon, Timer
} from "lucide-react";
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

export function PayrollPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-6 animate-fade-in">
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
                        <PlusIcon className="w-4 h-4" /> Run Payroll
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border-primary/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 transition-transform group-hover:scale-110 opacity-10">
                        <Banknote className="w-24 h-24" />
                    </div>
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Payout (Next Period)</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">{formatCurrency(452000000)}</h3>
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> 1.2%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Scheduled for Feb 28, 2026</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-sky-500/10 overflow-hidden relative group">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Average / Employee</p>
                        <h3 className="text-3xl font-bold">{formatCurrency(1822000)}</h3>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="outline" className="bg-sky-500/5 text-sky-600 border-sky-500/20 rounded-lg">Base Salary: 80%</Badge>
                            <Badge variant="outline" className="bg-sky-500/5 text-sky-600 border-sky-500/20 rounded-lg">Bonus: 20%</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-violet-500/10 overflow-hidden relative group">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">System Compliance</p>
                        <div className="flex items-center gap-3 mt-1 text-emerald-600">
                            <ShieldCheck className="w-8 h-8" />
                            <div>
                                <h4 className="font-bold">Fully Compliant</h4>
                                <p className="text-[10px] text-muted-foreground">All tax calculations are up to date</p>
                            </div>
                        </div>
                        <Button variant="link" className="text-primary p-0 h-auto text-xs mt-4">View Compliance Report <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </CardContent>
                </Card>
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
                                <Input placeholder="Search period..." className="pl-9 h-9 text-xs rounded-xl" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/5 border-b">
                                    <tr className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                        <th className="px-6 py-4">Period</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Total Payout</th>
                                        <th className="px-6 py-4">Employees</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {MOCK_PAYROLLS.map((p, i) => (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group transition-colors hover:bg-muted/10 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 font-bold text-sm">{p.period}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={cn(
                                                    "rounded-full text-[10px] px-2.5 py-0.5 border capitalize",
                                                    p.status === "processed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                        p.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                            "bg-sky-500/10 text-sky-600 border-sky-500/20"
                                                )}>
                                                    {p.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-semibold text-xs tracking-tighter">
                                                {formatCurrency(p.total_payout)}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{p.employees_count} Members</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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

function PlusIcon({ className }: { className?: string }) {
    return <DollarSign className={className} />;
}
