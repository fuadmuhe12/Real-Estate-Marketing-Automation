"use client";

import MetricCards from "@/modules/reporting/components/MetricCards";
import RecentActivity from "@/modules/reporting/components/RecentActivity";
import TokenUsageChart from "@/modules/reporting/components/TokenUsageChart";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your AI automation activity.
        </p>
      </div>

      <MetricCards />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TokenUsageChart />
        <RecentActivity />
      </div>
    </div>
  );
}
