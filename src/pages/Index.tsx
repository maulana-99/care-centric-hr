import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { PendingApprovals } from "@/components/dashboard/PendingApprovals";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DepartmentBreakdown } from "@/components/dashboard/DepartmentBreakdown";
import { EmployeesPage } from "@/components/pages/EmployeesPage";
import { LeaveManagementPage } from "@/components/pages/LeaveManagementPage";
import { AttendancePage } from "@/components/pages/AttendancePage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { ShiftPage } from "@/components/pages/ShiftPage";

export type PageType = "dashboard" | "employees" | "leave" | "attendance" | "payroll" | "documents" | "departments" | "settings" | "shifts";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "employees":
        return <EmployeesPage />;
      case "leave":
        return <LeaveManagementPage />;
      case "attendance":
        return <AttendancePage />;
      case "shifts":
        return <ShiftPage />;
      case "settings":
        return <SettingsPage />;
      case "payroll":
      case "documents":
      case "departments":
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2 capitalize">{currentPage}</h2>
              <p className="text-muted-foreground">This page is under construction</p>
            </div>
          </div>
        );
      default:
        return (
          <>
            <QuickStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PendingApprovals />
              </div>
              <div>
                <AttendanceOverview />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UpcomingEvents />
              <DepartmentBreakdown />
              <RecentActivity />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="ml-[260px] transition-all duration-300">
        <Header onNavigate={setCurrentPage} />

        <div className="p-6 space-y-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
