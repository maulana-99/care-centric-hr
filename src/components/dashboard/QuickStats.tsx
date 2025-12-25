import { Users, UserCheck, Briefcase, Clock } from "lucide-react";
import { MetricCard } from "./MetricCard";

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Employees"
        value={248}
        icon={Users}
        change={{ value: 3.2, type: "increase" }}
        variant="highlight"
        subtitle="Active workforce"
      />
      <MetricCard
        title="Present Today"
        value={198}
        icon={UserCheck}
        change={{ value: 2.1, type: "increase" }}
        subtitle="79.8% attendance"
      />
      <MetricCard
        title="Open Positions"
        value={12}
        icon={Briefcase}
        change={{ value: 4, type: "increase" }}
        subtitle="Across 5 departments"
      />
      <MetricCard
        title="Avg. Work Hours"
        value="8.2h"
        icon={Clock}
        change={{ value: 1.5, type: "decrease" }}
        subtitle="This week"
      />
    </div>
  );
}
