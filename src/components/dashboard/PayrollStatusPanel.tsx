import { DollarSign, Lock, Download, Play, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function PayrollStatusPanel() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Payroll Status
          </CardTitle>
          <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
            Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Info */}
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-xs text-muted-foreground mb-1">Periode Aktif</p>
          <p className="text-lg font-bold">Januari 2026</p>
          <p className="text-xs text-muted-foreground">Cut-off: 25 Jan 2026</p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">Total Gross</p>
            <p className="text-base font-bold">Rp 2.4M</p>
          </div>
          <div className="p-2 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">Overtime</p>
            <p className="text-base font-bold">Rp 180K</p>
          </div>
        </div>

        {/* BPJS Status */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Status BPJS</p>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">BPJS Kesehatan</span>
            </div>
            <span className="text-xs text-success">Valid</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="text-sm">BPJS TK</span>
            </div>
            <span className="text-xs text-warning">3 Missing</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Processing payroll..." })}
          >
            <Play className="h-3 w-3 mr-1" />
            Process
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={() => toast({ title: "Locking period..." })}
          >
            <Lock className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={() => toast({ title: "Exporting bank file..." })}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
