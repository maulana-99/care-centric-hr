import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaveManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Leave Management</h2>
      <Card>
        <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">12 pending leave requests. Full management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
