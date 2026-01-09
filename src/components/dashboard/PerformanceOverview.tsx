import { TrendingUp, Star, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const topPerformers = [
  { name: "Rina Wijaya", score: 95, dept: "Engineering" },
  { name: "Budi Santoso", score: 92, dept: "Sales" },
  { name: "Ahmad Fauzi", score: 90, dept: "Marketing" },
];

export function PerformanceOverview() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPI Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold text-primary">82%</p>
            <p className="text-xs text-muted-foreground">Avg KPI Score</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">4</p>
            <p className="text-xs text-muted-foreground">Low Performers</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Star className="h-3 w-3 text-warning" />
            Top Performers
          </p>
          {topPerformers.map((person, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{person.name}</p>
                <p className="text-xs text-muted-foreground">{person.dept}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-success">{person.score}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs"
          onClick={() => toast({ title: "Opening performance review..." })}
        >
          Open Performance Review
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
