import { Calendar, FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const pendingLeaves = [
  { name: "Rina Wijaya", type: "Annual Leave", dates: "15-17 Jan", status: "pending" },
  { name: "Budi Santoso", type: "Sick Leave", dates: "12 Jan", status: "pending" },
  { name: "Ahmad Fauzi", type: "Annual Leave", dates: "20-25 Jan", status: "pending" },
  { name: "Dewi Putri", type: "Permission", dates: "14 Jan", status: "pending" },
  { name: "Siti Rahma", type: "Annual Leave", dates: "18 Jan", status: "pending" },
];

export function LeaveApprovalCenter() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Leave & Approval
          </CardTitle>
          <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
            8 Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Calendar Placeholder */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <div 
              key={i} 
              className={`text-xs py-1 rounded ${
                [3, 4, 8].includes(i) 
                  ? 'bg-warning/20 text-warning font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              {i + 6}
            </div>
          ))}
        </div>

        {/* Pending Approvals List */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Pengajuan Terbaru</p>
          {pendingLeaves.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.dates}</span>
                <Clock className="h-3 w-3 text-warning" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening approval queue..." })}
          >
            <FileText className="h-3 w-3 mr-1" />
            Review (8)
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Exporting leave report..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
