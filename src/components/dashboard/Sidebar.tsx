import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import type { PageType } from "@/pages/Index";

interface NavItem {
  icon: React.ElementType;
  label: string;
  page: PageType;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
  { icon: Users, label: "Employees", page: "employees", badge: 248 },
  { icon: Calendar, label: "Leave Management", page: "leave", badge: 12 },
  { icon: Clock, label: "Attendance", page: "attendance" },
  { icon: DollarSign, label: "Payroll", page: "payroll" },
  { icon: FileText, label: "Documents", page: "documents" },
  { icon: Building2, label: "Departments", page: "departments" },
];

const bottomNavItems: Omit<NavItem, 'page'>[] = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help Center" },
];

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
  };

  const handleHelp = () => {
    toast.info("Opening Help Center...");
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground text-lg tracking-tight">
              HRFlow
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors",
            collapsed && "ml-0"
          )}
        >
          <ChevronLeft 
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              collapsed && "rotate-180"
            )} 
          />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavButton 
            key={item.label} 
            item={item} 
            collapsed={collapsed} 
            isActive={currentPage === item.page}
            onClick={() => onNavigate(item.page)}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.label === "Settings" ? onNavigate("settings") : handleHelp()}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
              currentPage === "settings" && item.label === "Settings"
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-semibold text-sm">SA</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Sarah Anderson</p>
              <p className="text-xs text-muted-foreground truncate">HR Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ item, collapsed, isActive, onClick }: NavButtonProps) {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
        collapsed && "justify-center px-0"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 shrink-0",
        isActive && "text-primary"
      )} />
      {!collapsed && (
        <>
          <span className="text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span className={cn(
              "ml-auto text-xs px-2 py-0.5 rounded-full",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              {item.badge}
            </span>
          )}
        </>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
      )}
    </button>
  );
}
