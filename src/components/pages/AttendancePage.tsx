import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AttendancePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Attendance</h2>
      <Card>
        <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">198 present today. Full attendance tracking coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
