"use client";

import { Card, CardContent } from "@/components/ui/card";
import ActivityLog from "@/modules/automation/components/ActivityLog";

export default function ActivityPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Activity
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Automation log of all AI-triggered actions.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <ActivityLog />
        </CardContent>
      </Card>
    </div>
  );
}
