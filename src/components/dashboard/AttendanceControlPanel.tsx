import { MapPin, Download, Monitor, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const recentAttendance = [
  { name: "Rina Wijaya", branch: "Jakarta HQ", status: "on-time", time: "08:02" },
  { name: "Budi Santoso", branch: "Bandung", status: "late", time: "09:15" },
  { name: "Dewi Putri", branch: "Jakarta HQ", status: "on-time", time: "07:58" },
  { name: "Ahmad Fauzi", branch: "Surabaya", status: "absent", time: "-" },
  { name: "Siti Rahma", branch: "Jakarta HQ", status: "on-time", time: "08:00" },
];

const statusConfig = {
  "on-time": { color: "text-success", bg: "bg-success/10", label: "On Time" },
  "late": { color: "text-warning", bg: "bg-warning/10", label: "Late" },
  "absent": { color: "text-destructive", bg: "bg-destructive/10", label: "Absent" },
};

export function AttendanceControlPanel() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Attendance Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-success/10">
            <CheckCircle className="h-4 w-4 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-success">186</p>
            <p className="text-xs text-muted-foreground">On Time</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-warning/10">
            <Clock className="h-4 w-4 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold text-warning">12</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <XCircle className="h-4 w-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold text-destructive">5</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>

        {/* Geofence Mini Map Placeholder */}
        <div className="h-20 rounded-lg bg-muted flex items-center justify-center border border-dashed border-border">
          <div className="text-center">
            <MapPin className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Geofence Map</p>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">5 Absensi Terakhir</p>
          {recentAttendance.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.branch}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.time}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[item.status].bg} ${statusConfig[item.status].color}`}>
                  {statusConfig[item.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Exporting attendance..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening live monitor..." })}
          >
            <Monitor className="h-3 w-3 mr-1" />
            Live Monitor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
