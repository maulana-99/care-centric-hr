import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText, FolderOpen, Upload, Search, Download,
    MoreVertical, FileCode, FileImage, FileStack,
    Shield, Share2, Star, Trash2, Clock, CheckCircle2,
    ChevronRight, Filter, Grid, List, HardDrive,
    ChevronLeft
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

interface HRDocument {
    id: number;
    name: string;
    type: "pdf" | "docx" | "xlsx" | "png" | "zip";
    category: "Policy" | "Contract" | "Training" | "Identity" | "Finance";
    size: string;
    updated_at: string;
    status: "active" | "archived" | "draft";
    is_favorite?: boolean;
}

const MOCK_DOCS: HRDocument[] = [
    { id: 1, name: "Employee_Handbook_2026.pdf", type: "pdf", category: "Policy", size: "2.4 MB", updated_at: "2026-01-10", status: "active", is_favorite: true },
    { id: 2, name: "Employment_Contract_Template.docx", type: "docx", category: "Contract", size: "450 KB", updated_at: "2025-12-15", status: "active" },
    { id: 3, name: "Offboarding_Checklist.xlsx", type: "xlsx", category: "Policy", size: "120 KB", updated_at: "2026-02-05", status: "draft" },
    { id: 4, name: "Q1_Safety_Training_Module.pdf", type: "pdf", category: "Training", size: "8.1 MB", updated_at: "2026-02-18", status: "active" },
    { id: 5, name: "Company_Logo_Kit.zip", type: "zip", category: "Identity", size: "24.5 MB", updated_at: "2025-11-20", status: "archived" },
    { id: 6, name: "Health_Insurance_Benefits.pdf", type: "pdf", category: "Finance", size: "1.1 MB", updated_at: "2026-01-25", status: "active", is_favorite: true },
    { id: 7, name: "Salary_Adjustment_Form.docx", type: "docx", category: "Finance", size: "380 KB", updated_at: "2026-02-12", status: "active" },
];

const CATEGORIES = ["All", "Policy", "Contract", "Training", "Identity", "Finance"];

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

export function DocumentsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    const filtered = MOCK_DOCS.filter(doc => {
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    const stats = useMemo(() => ({
        total: 120, // Mock total
        activeDocs: MOCK_DOCS.length,
        favorites: MOCK_DOCS.filter(d => d.is_favorite).length,
        storageUsed: "42.8 MB",
    }), []);

    const getFileIcon = (type: HRDocument["type"]) => {
        switch (type) {
            case "pdf": return <FileText className="text-rose-500" />;
            case "xlsx": return <FileStack className="text-emerald-500" />;
            case "docx": return <FileCode className="text-blue-500" />;
            case "png": return <FileImage className="text-purple-500" />;
            default: return <FileText className="text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Document Center</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        Centralized document management and policy storage
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => toast.success("Accessing cloud storage...")}>
                        <HardDrive className="w-4 h-4" /> Cloud
                    </Button>
                    <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20">
                        <Upload className="w-4 h-4" /> Upload
                    </Button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Documents" value={stats.activeDocs} icon={FileText} color="bg-primary/10 text-primary" sub="Repository size" />
                <StatCard label="Storage Used" value={stats.storageUsed} icon={HardDrive} color="bg-blue-500/10 text-blue-600" sub="Cloud capacity" />
                <StatCard label="Favorites" value={stats.favorites} icon={Star} color="bg-amber-500/10 text-amber-600" sub="Pinned documents" />
                <StatCard label="Security" value="Encrypted" icon={Shield} color="bg-emerald-500/10 text-emerald-600" sub="AES-256 Protocol" />
            </div>


            <div className="flex flex-col gap-6">
                {/* Controls - Consolidated Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 backdrop-blur-sm p-2 rounded-2xl border border-border/50 shadow-sm group">
                    <div className="flex items-center flex-1 gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 h-10 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Mode & Sort */}
                        <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50">
                            <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", viewMode === "grid" && "bg-background shadow-sm")} onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", viewMode === "list" && "bg-background shadow-sm")} onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[140px] h-10 rounded-xl bg-background/50 border-border/50 text-xs font-bold focus:ring-primary/20">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                    <SelectValue placeholder="Category" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat} className="rounded-lg text-xs">
                                        <div className="flex items-center justify-between w-full min-w-[120px]">
                                            <span>{cat}</span>
                                            <Badge variant="secondary" className="ml-2 text-[10px] h-4 min-w-[18px] flex items-center justify-center p-0 px-1 border-none bg-muted/50">
                                                {MOCK_DOCS.filter(d => cat === "All" || d.category === cat).length}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="rounded-xl h-10 px-4 gap-2 border-border/50 text-xs font-bold hover:bg-muted/50 whitespace-nowrap">
                            Sort By <Clock className="w-3 h-3 text-muted-foreground" />
                        </Button>

                        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

                        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-none rounded-lg py-1 px-3 text-[10px] font-bold whitespace-nowrap">
                            {filtered.length} records
                        </Badge>
                    </div>
                </div>

                {/* Mobile Category Pills (Scrollable) */}
                {/* Removed as per instruction */}

                <AnimatePresence mode="wait">
                    {viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
                        >
                            {paginatedData.map((doc, i) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group relative border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                                        <div className="p-5 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 relative">
                                                <div className="transform transition-transform group-hover:scale-110 duration-300">
                                                    {getFileIcon(doc.type)}
                                                </div>
                                                {doc.is_favorite && <Star className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-500" />}
                                            </div>
                                            <h4 className="text-xs font-bold text-foreground line-clamp-1 w-full px-2" title={doc.name}>{doc.name}</h4>
                                            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold tracking-wider">{doc.category} • {doc.size}</p>

                                            <div className="w-full h-px bg-border/50 my-4" />

                                            <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground font-mono">
                                                <span>{doc.updated_at}</span>
                                                <Badge variant="outline" className={cn("text-[8px] h-4 rounded-full", doc.status === "active" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-amber-500/5 text-amber-600 border-amber-500/10")}>{doc.status}</Badge>
                                            </div>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-background/80"><MoreVertical className="w-3.5 h-3.5" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-primary focus:bg-primary/5 focus:text-primary"><Download className="w-4 h-4" /> Download</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg gap-2"><Share2 className="w-4 h-4" /> Share</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-rose-500 focus:bg-rose-500/5 focus:text-rose-500"><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-card border rounded-2xl overflow-hidden shadow-sm"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-muted/30 border-b">
                                    <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                                        <th className="px-6 py-4">Document Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Size</th>
                                        <th className="px-6 py-4">Date Added</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginatedData.map((doc, i) => (
                                        <motion.tr
                                            key={doc.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="group hover:bg-muted/20 transition-all cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                                                        {getFileIcon(doc.type)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold truncate max-w-[200px]">{doc.name}</span>
                                                        {doc.is_favorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{doc.category}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{doc.size}</td>
                                            <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{doc.updated_at}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={cn("text-[9px] rounded-full", doc.status === "active" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-amber-500/5 text-amber-600 border-amber-500/10")}>{doc.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Download className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Share2 className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border shadow-sm mt-6">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rows:</span>
                            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
                                <SelectTrigger className="w-[60px] h-8 text-xs bg-muted/40 border-border/50 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {[8, 12, 24, 48].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
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
                                                    "h-8 w-8 text-xs font-bold rounded-lg transition-all",
                                                    currentPage === p ? "bg-primary text-primary-foreground shadow-md scale-105" : "hover:bg-background/80"
                                                )}
                                                onClick={() => setCurrentPage(p)}
                                            >
                                                {p}
                                            </Button>
                                        ) : (
                                            <span key={idx} className="text-xs text-muted-foreground font-bold px-1 select-none">...</span>
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

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl bg-muted/20">
                        <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-bold">No documents found</h3>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>Reset Filter</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
