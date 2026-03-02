import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      <Card>
        <CardHeader><CardTitle>Application Settings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Configure your HRIS preferences here. Full settings coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
