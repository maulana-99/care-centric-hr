import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { KPISummaryStrip } from "@/components/dashboard/KPISummaryStrip";
import { AttendanceControlPanel } from "@/components/dashboard/AttendanceControlPanel";
import { LeaveApprovalCenter } from "@/components/dashboard/LeaveApprovalCenter";
import { ShiftWorkforceSnapshot } from "@/components/dashboard/ShiftWorkforceSnapshot";
import { PayrollStatusPanel } from "@/components/dashboard/PayrollStatusPanel";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { RecruitmentSnapshot } from "@/components/dashboard/RecruitmentSnapshot";
import { AssetSnapshot } from "@/components/dashboard/AssetSnapshot";
import { MasterDataControl } from "@/components/dashboard/MasterDataControl";
import { EmployeesPage } from "@/components/pages/EmployeesPage";
import { LeaveManagementPage } from "@/components/pages/LeaveManagementPage";
import { AttendancePage } from "@/components/pages/AttendancePage";
import { SettingsPage } from "@/components/pages/SettingsPage";

export type PageType = "dashboard" | "employees" | "leave" | "attendance" | "payroll" | "documents" | "departments" | "settings";

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
          <div className="space-y-5">
            {/* KPI Summary Strip */}
            <KPISummaryStrip />
            
            {/* Main 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Column 1 */}
              <div className="space-y-5">
                <AttendanceControlPanel />
                <PayrollStatusPanel />
              </div>
              
              {/* Column 2 */}
              <div className="space-y-5">
                <LeaveApprovalCenter />
                <PerformanceOverview />
              </div>
              
              {/* Column 3 */}
              <div className="space-y-5">
                <ShiftWorkforceSnapshot />
                <RecruitmentSnapshot />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <AssetSnapshot />
              <MasterDataControl />
              <div className="lg:col-span-1" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="ml-[260px] transition-all duration-300">
        <Header onNavigate={setCurrentPage} />
        
        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
