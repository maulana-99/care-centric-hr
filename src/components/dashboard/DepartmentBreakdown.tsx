import { cn } from "@/lib/utils";

interface Department {
  name: string;
  count: number;
  color: string;
  growth: number;
}

const departments: Department[] = [
  { name: "Engineering", count: 78, color: "bg-primary", growth: 12 },
  { name: "Sales", count: 45, color: "bg-warning", growth: 8 },
  { name: "Marketing", count: 32, color: "bg-accent", growth: -3 },
  { name: "Design", count: 28, color: "bg-success", growth: 5 },
  { name: "Operations", count: 35, color: "bg-secondary-foreground", growth: 2 },
  { name: "Finance", count: 18, color: "bg-destructive/70", growth: 0 },
  { name: "HR", count: 12, color: "bg-muted-foreground", growth: 1 },
];

const total = departments.reduce((sum, d) => sum + d.count, 0);

export function DepartmentBreakdown() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Headcount by Department</h3>
          <p className="text-sm text-muted-foreground">{total} total employees</p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-6">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={cn("transition-all duration-500", dept.color)}
            style={{ width: `${(dept.count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Department list */}
      <div className="space-y-3">
        {departments.map((dept, index) => (
          <div
            key={dept.name}
            className="flex items-center gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className={cn("w-3 h-3 rounded-sm shrink-0", dept.color)} />
            <span className="text-sm text-foreground flex-1">{dept.name}</span>
            <span className="text-sm font-medium text-foreground">{dept.count}</span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                dept.growth > 0
                  ? "text-success bg-success/10"
                  : dept.growth < 0
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground bg-muted"
              )}
            >
              {dept.growth > 0 ? "+" : ""}{dept.growth}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
