import { Users, UserCheck, Calendar, Clock, DollarSign, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  status?: "success" | "warning" | "danger" | "neutral";
  subtitle?: string;
}

function KPICard({ title, value, icon: Icon, status = "neutral", subtitle }: KPICardProps) {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    neutral: "text-primary",
  };

  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
          <Icon className={`h-4 w-4 ${statusColors[status]}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${statusColors[status]}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export function KPISummaryStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        title="Kehadiran Hari Ini"
        value="87%"
        icon={UserCheck}
        status="success"
        subtitle="12 terlambat, 5 alpha"
      />
      <KPICard
        title="Karyawan Aktif"
        value={248}
        icon={Users}
        status="neutral"
        subtitle="dari 260 total"
      />
      <KPICard
        title="Cuti Pending"
        value={8}
        icon={Calendar}
        status="warning"
        subtitle="perlu review"
      />
      <KPICard
        title="Shift Hari Ini"
        value={12}
        icon={Clock}
        status="neutral"
        subtitle="3 lokasi"
      />
      <KPICard
        title="Payroll Status"
        value="Open"
        icon={DollarSign}
        status="warning"
        subtitle="Jan 2026"
      />
      <KPICard
        title="Low Performance"
        value={4}
        icon={TrendingDown}
        status="danger"
        subtitle="di bawah KPI"
      />
    </div>
  );
}
