import { Package, CheckCircle, AlertTriangle, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

const recentAssetActivity = [
  { action: "Assign", asset: "Laptop Dell XPS", to: "Rina Wijaya", time: "2h ago" },
  { action: "Return", asset: "iPhone 14", to: "Budi Santoso", time: "5h ago" },
  { action: "Repair", asset: "Monitor LG 27\"", to: "IT Dept", time: "1d ago" },
  { action: "Assign", asset: "Keyboard MX", to: "Ahmad Fauzi", time: "1d ago" },
  { action: "Lost", asset: "Mouse Pro", to: "Finance", time: "2d ago" },
];

export function AssetSnapshot() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Asset Management"
      icon={<Package className="h-4 w-4" />}
      size="xl"
      col={1}
      showSeeAll
      onSeeAll={() => toast({ title: "Opening asset list..." })}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening asset register..." })}
          >
            <Plus className="h-3 w-3 mr-1" />
            Register
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8"
            onClick={() => toast({ title: "Generating asset report..." })}
          >
            <FileText className="h-3 w-3" />
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Asset Stats */}
        <div className="grid grid-cols-3 gap-1">
          <div className="text-center p-1.5 rounded-lg bg-muted">
            <CheckCircle className="h-3 w-3 text-success mx-auto mb-0.5" />
            <p className="text-sm font-bold">156</p>
            <p className="text-[10px] text-muted-foreground">In Use</p>
          </div>
          <div className="text-center p-1.5 rounded-lg bg-muted">
            <Package className="h-3 w-3 text-primary mx-auto mb-0.5" />
            <p className="text-sm font-bold">42</p>
            <p className="text-[10px] text-muted-foreground">Available</p>
          </div>
          <div className="text-center p-1.5 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-3 w-3 text-destructive mx-auto mb-0.5" />
            <p className="text-sm font-bold text-destructive">5</p>
            <p className="text-[10px] text-muted-foreground">Issue</p>
          </div>
        </div>

        {/* Total Assets */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
          <div>
            <p className="text-[10px] text-muted-foreground">Total Aset</p>
            <p className="text-lg font-bold">203</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Value</p>
            <p className="text-xs font-semibold">Rp 1.2B</p>
          </div>
        </div>

        {/* Recent Activity - Scrollable */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">Aktivitas Terakhir</p>
          {recentAssetActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.asset}</p>
                <p className="text-[10px] text-muted-foreground">{item.action} → {item.to}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
