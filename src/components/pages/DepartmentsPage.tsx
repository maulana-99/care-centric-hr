import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2, Users, User, ArrowUpRight,
    MapPin, Plus, Search, MoreVertical,
    Activity, TrendingUp, Layers, ChevronRight,
    Monitor, Palette, Lightbulb, HeartHandshake, Megaphone, Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Department {
    id: number;
    name: string;
    manager: string;
    manager_avatar: string;
    headcount: number;
    open_positions: number;
    location: string;
    description: string;
    icon: any;
    color: string;
}

const MOCK_DEPTS: Department[] = [
    { id: 1, name: "Engineering", manager: "Daniel Martinez", manager_avatar: "https://i.pravatar.cc/150?u=10", headcount: 42, open_positions: 5, location: "Jakarta, HQ", description: "Core product development, infrastructure, and technical architecture.", icon: Monitor, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
    { id: 2, name: "Design", manager: "Michael Brown", manager_avatar: "https://i.pravatar.cc/150?u=4", headcount: 12, open_positions: 2, location: "Remote", description: "UI/UX design, brand identity, and creative direction.", icon: Palette, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
    { id: 3, name: "Product", manager: "Jessica Lee", manager_avatar: "https://i.pravatar.cc/150?u=5", headcount: 15, open_positions: 1, location: "Jakarta, HQ", description: "Product discovery, roadmap management, and strategy.", icon: Lightbulb, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
    { id: 4, name: "Human Resources", manager: "Sarah Anderson", manager_avatar: "https://i.pravatar.cc/150?u=1", headcount: 8, open_positions: 0, location: "Jakarta, HQ", description: "Recruitment, cultural development, and employee success.", icon: HeartHandshake, color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
    { id: 5, name: "Marketing", manager: "Olivia Davis", manager_avatar: "https://i.pravatar.cc/150?u=9", headcount: 20, open_positions: 3, location: "Bandung Branch", description: "Brand awareness, growth marketing, and content strategy.", icon: Megaphone, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    { id: 6, name: "Finance", manager: "Robert Gray", manager_avatar: "https://i.pravatar.cc/150?u=11", headcount: 6, open_positions: 1, location: "Jakarta, HQ", description: "Financial planning, accounting, and payroll management.", icon: Coins, color: "text-sky-600 bg-sky-500/10 border-sky-500/20" },
];

export function DepartmentsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = MOCK_DEPTS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.manager.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-3xl border shadow-sm px-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground text-brand-dark">Departments</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Organizational structure and team management
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64 lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search department or manager..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>
                    <Button className="gap-2 gradient-primary shadow-lg shadow-primary/20 rounded-xl px-5 py-5">
                        <Plus className="w-4 h-4" /> New Team
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Departments</p>
                            <h3 className="text-2xl font-bold">{MOCK_DEPTS.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <Users className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staff Strength</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold">103</h3>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/5 px-2 py-0.5 rounded-full">+4 this month</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border shadow-sm p-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <Activity className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Open Role (Req)</p>
                            <h3 className="text-2xl font-bold">12</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filtered.map((dept, i) => (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="group rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-0">
                                <div className="p-6 flex items-start justify-between border-b bg-muted/5 group-hover:bg-primary/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", dept.color)}>
                                            <dept.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{dept.name}</h3>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                                                <MapPin className="w-3 h-3" /> {dept.location}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="p-6 space-y-5">
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {dept.description}
                                    </p>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                                                <AvatarImage src={dept.manager_avatar} />
                                                <AvatarFallback>{dept.manager.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Team Lead</p>
                                                <p className="text-sm font-bold truncate max-w-[120px]">{dept.manager}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/50">
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-4 pt-1">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Headcount</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-extrabold">{dept.headcount}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">Members</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${(dept.headcount / 50) * 100}%` }} />
                                            </div>
                                        </div>
                                        <div className="w-px h-10 bg-border/50" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hiring</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-extrabold text-emerald-600">{dept.open_positions}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">Roles</span>
                                            </div>
                                            <p className="text-[9px] text-emerald-600 font-bold bg-emerald-500/5 px-2 py-0.5 rounded-full inline-block">Active Rec</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-2">
                                    <Button className="w-full rounded-2xl h-11 bg-muted/50 hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all border-none text-foreground hover:text-primary-foreground group-hover:bg-primary" variant="secondary">
                                        View Team Directory <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
