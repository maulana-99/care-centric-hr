import { Building2, MapPin, Users, Network, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function MasterDataControl() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Org Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Companies</span>
            </div>
            <p className="text-xl font-bold">3</p>
          </div>
          <div className="p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Branches</span>
            </div>
            <p className="text-xl font-bold">8</p>
          </div>
        </div>

        {/* Department & Employee Stats */}
        <div className="p-3 rounded-lg bg-muted">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Departments</span>
            </div>
            <span className="text-lg font-bold">12</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Employees</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">248</span>
              <span className="text-xs text-muted-foreground ml-1">/ 260</span>
            </div>
          </div>
        </div>

        {/* Employee Status */}
        <div className="flex gap-2">
          <div className="flex-1 p-2 rounded-lg bg-success/10 text-center">
            <p className="text-sm font-bold text-success">248</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="flex-1 p-2 rounded-lg bg-muted text-center">
            <p className="text-sm font-bold">12</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening employee directory..." })}
          >
            <Users className="h-3 w-3 mr-1" />
            Directory
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening org chart..." })}
          >
            <Network className="h-3 w-3 mr-1" />
            Org Chart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
