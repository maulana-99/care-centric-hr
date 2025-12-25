import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DepartmentBreakdown } from "@/components/dashboard/DepartmentBreakdown";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="ml-[260px] transition-all duration-300">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <QuickStats />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pending Approvals */}
            <div className="lg:col-span-2">
              <PendingApprovals />
            </div>

            {/* Right Column - Attendance */}
            <div>
              <AttendanceOverview />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events */}
            <UpcomingEvents />

            {/* Department Breakdown */}
            <DepartmentBreakdown />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
