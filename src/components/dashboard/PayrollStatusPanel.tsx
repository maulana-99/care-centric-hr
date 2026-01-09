import { DollarSign, Lock, Download, Play, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

export function PayrollStatusPanel() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Payroll Status"
      icon={<DollarSign className="h-4 w-4" />}
      badge={
        <Badge variant="secondary" className="bg-warning/10 text-warning border-0 text-[10px]">
          Open
        </Badge>
      }
      size="xl"
      col={1}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Processing payroll..." })}
          >
            <Play className="h-3 w-3 mr-1" />
            Process
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8"
            onClick={() => toast({ title: "Locking period..." })}
          >
            <Lock className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8"
            onClick={() => toast({ title: "Exporting bank file..." })}
          >
            <Download className="h-3 w-3" />
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Period Info */}
        <div className="p-2 rounded-lg bg-muted">
          <p className="text-[10px] text-muted-foreground mb-0.5">Periode Aktif</p>
          <p className="text-sm font-bold">Januari 2026</p>
          <p className="text-[10px] text-muted-foreground">Cut-off: 25 Jan 2026</p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border border-border">
            <p className="text-[10px] text-muted-foreground">Total Gross</p>
            <p className="text-sm font-bold">Rp 2.4M</p>
          </div>
          <div className="p-2 rounded-lg border border-border">
            <p className="text-[10px] text-muted-foreground">Overtime</p>
            <p className="text-sm font-bold">Rp 180K</p>
          </div>
        </div>

        {/* BPJS Status */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">Status BPJS</p>
          <div className="flex items-center justify-between p-1.5 rounded-lg border border-border">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" />
              <span className="text-xs">BPJS Kesehatan</span>
            </div>
            <span className="text-[10px] text-success">Valid</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg border border-border">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-warning" />
              <span className="text-xs">BPJS TK</span>
            </div>
            <span className="text-[10px] text-warning">3 Missing</span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
