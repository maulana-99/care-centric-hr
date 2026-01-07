import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Employees</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10 w-64" />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Employee Directory</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">248 employees in the system. Full directory coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
