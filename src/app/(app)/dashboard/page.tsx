"use client";

import { FileText, Users, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMetricsQuery } from "@/lib/api/metricsApi";
import { Skeleton } from "@/components/ui/skeleton";

const metricCards = [
  { key: "postsGenerated" as const, label: "Posts Generated", icon: FileText },
  { key: "leadsContacted" as const, label: "Leads Contacted", icon: Users },
  { key: "tokensUsed" as const, label: "Tokens Used", icon: Coins },
];

export default function DashboardPage() {
  const { data, isLoading } = useGetMetricsQuery();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your AI automation activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.key}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {data?.[card.key] ?? 0}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent breakdown */}
      {data?.agentMetrics && data.agentMetrics.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Agent Token Usage
            </h2>
            <div className="space-y-3">
              {data.agentMetrics.map((agent) => {
                const pct = Math.round(
                  ((100 - agent.tokensRemaining) / 100) * 100
                );
                return (
                  <div key={agent.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {agent.name}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {agent.tokensUsed} / 100 used
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
