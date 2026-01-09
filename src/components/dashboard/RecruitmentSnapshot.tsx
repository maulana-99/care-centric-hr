import { Briefcase, Users, Calendar, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const upcomingInterviews = [
  { name: "John Doe", position: "Frontend Dev", time: "10:00" },
  { name: "Jane Smith", position: "Product Manager", time: "14:00" },
];

export function RecruitmentSnapshot() {
  const { toast } = useToast();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Recruitment
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            5 Open
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">5</p>
            <p className="text-xs text-muted-foreground">Vacancies</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">23</p>
            <p className="text-xs text-muted-foreground">Candidates</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <p className="text-lg font-bold">8</p>
            <p className="text-xs text-muted-foreground">Interview</p>
          </div>
        </div>

        {/* Pipeline Visual */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Pipeline</p>
          <div className="flex gap-0.5 h-2">
            <div className="flex-[10] bg-muted-foreground/30 rounded-l" title="Applied: 10" />
            <div className="flex-[8] bg-primary/50" title="Screening: 8" />
            <div className="flex-[3] bg-primary/70" title="Interview: 3" />
            <div className="flex-[2] bg-primary rounded-r" title="Offer: 2" />
          </div>
        </div>

        {/* Today's Interviews */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Interview Hari Ini
          </p>
          {upcomingInterviews.map((interview, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{interview.name}</p>
                  <p className="text-xs text-muted-foreground">{interview.position}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-primary">{interview.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => toast({ title: "Opening ATS..." })}
          >
            Open ATS
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={() => toast({ title: "Generating report..." })}
          >
            <FileText className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
