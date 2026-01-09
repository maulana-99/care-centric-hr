import { MapPin, Download, Monitor, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

const recentAttendance = [
  { name: "Rina Wijaya", branch: "Jakarta HQ", status: "on-time" as const, time: "08:02" },
  { name: "Budi Santoso", branch: "Bandung", status: "late" as const, time: "09:15" },
  { name: "Dewi Putri", branch: "Jakarta HQ", status: "on-time" as const, time: "07:58" },
  { name: "Ahmad Fauzi", branch: "Surabaya", status: "absent" as const, time: "-" },
  { name: "Siti Rahma", branch: "Jakarta HQ", status: "on-time" as const, time: "08:00" },
];

const statusConfig = {
  "on-time": { color: "text-success", bg: "bg-success/10", label: "On Time" },
  "late": { color: "text-warning", bg: "bg-warning/10", label: "Late" },
  "absent": { color: "text-destructive", bg: "bg-destructive/10", label: "Absent" },
};

export function AttendanceControlPanel() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Attendance Control"
      icon={<MapPin className="h-4 w-4" />}
      size="xl"
      col={1}
      showSeeAll
      onSeeAll={() => toast({ title: "Opening attendance..." })}
      actions={
        <>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Exporting attendance..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening live monitor..." })}
          >
            <Monitor className="h-3 w-3 mr-1" />
            Live Monitor
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-success/10">
            <CheckCircle className="h-3 w-3 text-success mx-auto mb-1" />
            <p className="text-sm font-bold text-success">186</p>
            <p className="text-[10px] text-muted-foreground">On Time</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-warning/10">
            <Clock className="h-3 w-3 text-warning mx-auto mb-1" />
            <p className="text-sm font-bold text-warning">12</p>
            <p className="text-[10px] text-muted-foreground">Late</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <XCircle className="h-3 w-3 text-destructive mx-auto mb-1" />
            <p className="text-sm font-bold text-destructive">5</p>
            <p className="text-[10px] text-muted-foreground">Absent</p>
          </div>
        </div>

        {/* Geofence Mini Map */}
        <div className="h-16 rounded-lg bg-muted flex items-center justify-center border border-dashed border-border">
          <div className="text-center">
            <MapPin className="h-4 w-4 text-muted-foreground mx-auto" />
            <p className="text-[10px] text-muted-foreground">Geofence Map</p>
          </div>
        </div>

        {/* Recent Attendance - Scrollable */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">5 Absensi Terakhir</p>
          {recentAttendance.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.branch}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusConfig[item.status].bg} ${statusConfig[item.status].color}`}>
                  {statusConfig[item.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
