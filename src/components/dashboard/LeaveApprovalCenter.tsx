import { Calendar, FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "./BentoCard";
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
    <BentoCard
      title="Leave & Approval"
      icon={<Calendar className="h-4 w-4" />}
      badge={
        <Badge variant="secondary" className="bg-warning/10 text-warning border-0 text-[10px]">
          8 Pending
        </Badge>
      }
      size="xl"
      col={1}
      showSeeAll
      onSeeAll={() => toast({ title: "Opening all approvals..." })}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening approval queue..." })}
          >
            <FileText className="h-3 w-3 mr-1" />
            Review (8)
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Exporting leave report..." })}
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Mini Calendar */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] text-muted-foreground font-medium py-0.5">{d}</div>
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <div 
              key={i} 
              className={`text-[10px] py-0.5 rounded ${
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
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">Pengajuan Terbaru</p>
          {pendingLeaves.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 -mx-1 px-1 rounded">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.type}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{item.dates}</span>
                <Clock className="h-3 w-3 text-warning" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
