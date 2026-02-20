import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText, FolderOpen, Upload, Search, Download,
    MoreVertical, FileCode, FileImage, FileStack,
    Shield, Share2, Star, Trash2, Clock, CheckCircle2,
    ChevronRight, Filter, Grid, List, HardDrive
} from "lucide-react";
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

export function DocumentsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = MOCK_DOCS.filter(doc => {
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
        <div className="space-y-6 animate-fade-in mb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm sm:px-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Document Center</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" />
                        Centralized document management and policy storage
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 rounded-xl" onClick={() => toast.success("Accessing cloud storage...")}>
                        <HardDrive className="w-4 h-4" /> Cloud Storage
                    </Button>
                    <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20 rounded-xl">
                        <Upload className="w-4 h-4" /> Upload Document
                    </Button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* Sidebar / Categories */}
                <div className="xl:w-64 space-y-4">
                    <Card className="rounded-2xl border-none bg-muted/30 h-full p-2">
                        <div className="p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Library</p>
                            <div className="space-y-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all",
                                            selectedCategory === cat ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FolderOpen className="w-4 h-4" /> {cat}
                                        </span>
                                        {selectedCategory !== cat && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-md">
                                            {MOCK_DOCS.filter(d => cat === "All" || d.category === cat).length}
                                        </span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 pt-0">
                            <div className="p-3 border-t border-border/50">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">Security</p>
                                <div className="space-y-4 px-3">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <Shield className="w-4 h-4 text-emerald-500" />
                                        <span>Encrypted Storage</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Audit Log Enabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-4">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search documents by name..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-muted/40 p-1 rounded-xl border mr-2">
                                <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", viewMode === "grid" && "bg-background shadow-sm")} onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-lg", viewMode === "list" && "bg-background shadow-sm")} onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
                            </div>
                            <Button variant="outline" className="rounded-xl h-11 px-4 gap-2 border-border/50">
                                <Filter className="w-4 h-4" /> Sort By <Clock className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {viewMode === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5"
                            >
                                {filtered.map((doc, i) => (
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
                                        {filtered.map((doc, i) => (
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
        </div>
    );
}
