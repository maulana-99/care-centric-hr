import { Building2, MapPin, Users, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

export function MasterDataControl() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Organization"
      icon={<Building2 className="h-4 w-4" />}
      size="xl"
      col={1}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening employee directory..." })}
          >
            <Users className="h-3 w-3 mr-1" />
            Directory
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening org chart..." })}
          >
            <Network className="h-3 w-3 mr-1" />
            Org Chart
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Org Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors">
            <div className="flex items-center gap-1 mb-1">
              <Building2 className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Companies</span>
            </div>
            <p className="text-lg font-bold">3</p>
          </div>
          <div className="p-2 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Branches</span>
            </div>
            <p className="text-lg font-bold">8</p>
          </div>
        </div>

        {/* Department & Employee Stats */}
        <div className="p-2 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Network className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">Departments</span>
            </div>
            <span className="text-sm font-bold">12</span>
          </div>
          <div className="h-px bg-border my-1.5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">Employees</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold">248</span>
              <span className="text-[10px] text-muted-foreground ml-0.5">/ 260</span>
            </div>
          </div>
        </div>

        {/* Employee Status */}
        <div className="flex gap-2">
          <div className="flex-1 p-1.5 rounded-lg bg-success/10 text-center">
            <p className="text-xs font-bold text-success">248</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="flex-1 p-1.5 rounded-lg bg-muted text-center">
            <p className="text-xs font-bold">12</p>
            <p className="text-[10px] text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
