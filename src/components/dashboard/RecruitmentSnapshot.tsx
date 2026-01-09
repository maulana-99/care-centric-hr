import { Briefcase, Users, Calendar, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BentoCard } from "./BentoCard";
import { useToast } from "@/hooks/use-toast";

const upcomingInterviews = [
  { name: "John Doe", position: "Frontend Dev", time: "10:00" },
  { name: "Jane Smith", position: "Product Manager", time: "14:00" },
];

export function RecruitmentSnapshot() {
  const { toast } = useToast();

  return (
    <BentoCard
      title="Recruitment"
      icon={<Briefcase className="h-4 w-4" />}
      badge={
        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px]">
          5 Open
        </Badge>
      }
      size="xl"
      col={1}
      actions={
        <>
          <Button 
            size="sm" 
            className="flex-1 text-xs h-8"
            onClick={() => toast({ title: "Opening ATS..." })}
          >
            Open ATS
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8"
            onClick={() => toast({ title: "Generating report..." })}
          >
            <FileText className="h-3 w-3" />
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="p-1.5 rounded-lg bg-muted">
            <p className="text-sm font-bold">5</p>
            <p className="text-[10px] text-muted-foreground">Vacancies</p>
          </div>
          <div className="p-1.5 rounded-lg bg-muted">
            <p className="text-sm font-bold">23</p>
            <p className="text-[10px] text-muted-foreground">Candidates</p>
          </div>
          <div className="p-1.5 rounded-lg bg-muted">
            <p className="text-sm font-bold">8</p>
            <p className="text-[10px] text-muted-foreground">Interview</p>
          </div>
        </div>

        {/* Pipeline Visual */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium text-muted-foreground">Pipeline</p>
          <div className="flex gap-0.5 h-2">
            <div className="flex-[10] bg-muted-foreground/30 rounded-l" title="Applied: 10" />
            <div className="flex-[8] bg-primary/50" title="Screening: 8" />
            <div className="flex-[3] bg-primary/70" title="Interview: 3" />
            <div className="flex-[2] bg-primary rounded-r" title="Offer: 2" />
          </div>
        </div>

        {/* Today's Interviews */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Interview Hari Ini
          </p>
          {upcomingInterviews.map((interview, i) => (
            <div key={i} className="flex items-center justify-between p-1.5 rounded-lg border border-border">
              <div className="flex items-center gap-1.5">
                <Users className="h-3 w-3 text-primary" />
                <div>
                  <p className="text-xs font-medium">{interview.name}</p>
                  <p className="text-[10px] text-muted-foreground">{interview.position}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-primary">{interview.time}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
}
