import { Clock, Users, AlertTriangle, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function ShiftWorkforceSnapshot() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Shift & Workforce
          </CardTitle>
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
            2 Warnings
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Shift Aktif</span>
            </div>
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">hari ini</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Belum Assign</span>
            </div>
            <p className="text-xl font-bold text-warning">8</p>
            <p className="text-xs text-muted-foreground">karyawan</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
            <p className="text-xs text-warning">3 karyawan multi-shift conflict</p>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
            <p className="text-xs text-destructive">Shift malam kekurangan 2 orang</p>
          </div>
        </div>

        {/* Shift Distribution */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Distribusi Shift</p>
          <div className="flex gap-1 h-4">
            <div className="flex-[4] bg-primary rounded-l" title="Morning: 4 shifts" />
            <div className="flex-[5] bg-primary/70" title="Day: 5 shifts" />
            <div className="flex-[3] bg-primary/40 rounded-r" title="Night: 3 shifts" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Morning (4)</span>
            <span>Day (5)</span>
            <span>Night (3)</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening mass assign..." })}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Mass Assign
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Exporting schedule..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
