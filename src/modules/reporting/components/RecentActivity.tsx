"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ActivityLog from "@/modules/automation/components/ActivityLog";

export default function RecentActivity() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/activity"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <ActivityLog limit={5} />
      </CardContent>
    </Card>
  );
}
