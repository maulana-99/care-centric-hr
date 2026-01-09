import { Clock, Users, AlertTriangle, UserPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

export function ShiftWorkforceSnapshot() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Shift & Workforce"
      icon={<Clock className="h-4 w-4" />}
      badge={
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 text-[10px]">
          2 Warnings
        </Badge>
      }
      size="xl"
      col={1}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening mass assign..." })}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Mass Assign
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Exporting schedule..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-muted">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Shift Aktif</span>
            </div>
            <p className="text-lg font-bold">12</p>
            <p className="text-[10px] text-muted-foreground">hari ini</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Belum Assign</span>
            </div>
            <p className="text-lg font-bold text-warning">8</p>
            <p className="text-[10px] text-muted-foreground">karyawan</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0" />
            <p className="text-[10px] text-warning">3 karyawan multi-shift conflict</p>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
            <p className="text-[10px] text-destructive">Shift malam kekurangan 2 orang</p>
          </div>
        </div>

        {/* Shift Distribution */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">Distribusi Shift</p>
          <div className="flex gap-0.5 h-3">
            <div className="flex-[4] bg-primary rounded-l" title="Morning: 4 shifts" />
            <div className="flex-[5] bg-primary/70" title="Day: 5 shifts" />
            <div className="flex-[3] bg-primary/40 rounded-r" title="Night: 3 shifts" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Morning (4)</span>
            <span>Day (5)</span>
            <span>Night (3)</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
