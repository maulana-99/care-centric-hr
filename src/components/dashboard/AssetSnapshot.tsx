import { Package, CheckCircle, AlertTriangle, XCircle, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const recentAssetActivity = [
  { action: "Assign", asset: "Laptop Dell XPS", to: "Rina Wijaya", time: "2h ago" },
  { action: "Return", asset: "iPhone 14", to: "Budi Santoso", time: "5h ago" },
  { action: "Repair", asset: "Monitor LG 27\"", to: "IT Dept", time: "1d ago" },
];

export function AssetSnapshot() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Asset Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asset Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-muted">
            <CheckCircle className="h-4 w-4 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">156</p>
            <p className="text-xs text-muted-foreground">In Use</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <Package className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">42</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold text-destructive">5</p>
            <p className="text-xs text-muted-foreground">Issue</p>
          </div>
        </div>

        {/* Total Assets */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <div>
            <p className="text-xs text-muted-foreground">Total Aset</p>
            <p className="text-xl font-bold">203</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="text-sm font-semibold">Rp 1.2B</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Aktivitas Terakhir</p>
          {recentAssetActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.asset}</p>
                <p className="text-xs text-muted-foreground">{item.action} → {item.to}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening asset register..." })}
          >
            <Plus className="h-3 w-3 mr-1" />
            Register
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={() => toast({ title: "Generating asset report..." })}
          >
            <FileText className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
