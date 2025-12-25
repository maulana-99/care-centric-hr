import { cn } from "@/lib/utils";

interface AttendanceData {
  label: string;
  value: number;
  total: number;
  color: string;
}

const attendanceData: AttendanceData[] = [
  { label: "Present", value: 198, total: 248, color: "bg-primary" },
  { label: "On Leave", value: 24, total: 248, color: "bg-warning" },
  { label: "Remote", value: 18, total: 248, color: "bg-accent" },
  { label: "Absent", value: 8, total: 248, color: "bg-destructive" },
];

export function AttendanceOverview() {
  const presentPercentage = Math.round((198 / 248) * 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Attendance</h3>
          <p className="text-sm text-muted-foreground">Real-time workforce status</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gradient">{presentPercentage}%</p>
          <p className="text-xs text-muted-foreground">Attendance rate</p>
        </div>
      </div>

      {/* Progress Ring Visual */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${presentPercentage * 2.64} 264`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">198</span>
            <span className="text-xs text-muted-foreground">of 248</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        {attendanceData.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
