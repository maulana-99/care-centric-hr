import { TrendingUp, Star, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

const topPerformers = [
  { name: "Rina Wijaya", score: 95, dept: "Engineering" },
  { name: "Budi Santoso", score: 92, dept: "Sales" },
  { name: "Ahmad Fauzi", score: 90, dept: "Marketing" },
];

export function PerformanceOverview() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Performance"
      icon={<TrendingUp className="h-4 w-4" />}
      size="xl"
      col={1}
      actions={
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs h-8"
          onClick={() => toast({ title: "Opening performance review..." })}
        >
          Open Performance Review
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      }
    >
      <div className="space-y-3">
        {/* KPI Overview */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-muted text-center">
            <p className="text-xl font-bold text-primary">82%</p>
            <p className="text-[10px] text-muted-foreground">Avg KPI Score</p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10 text-center">
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3 text-destructive" />
            </div>
            <p className="text-xl font-bold text-destructive">4</p>
            <p className="text-[10px] text-muted-foreground">Low Performers</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3 text-warning" />
            Top Performers
          </p>
          {topPerformers.map((person, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted cursor-pointer">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{person.name}</p>
                <p className="text-[10px] text-muted-foreground">{person.dept}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-success">{person.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
