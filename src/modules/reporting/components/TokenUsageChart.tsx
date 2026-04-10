"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMetricsQuery } from "@/lib/api/metricsApi";
import { cn } from "@/lib/utils";

export default function TokenUsageChart() {
  const { data, isLoading } = useGetMetricsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="mb-4 h-4 w-40" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const agents = data?.agentMetrics ?? [];

  if (agents.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Agent Token Usage
        </h2>
        <div className="space-y-4">
          {agents.map((agent) => {
            const pct = Math.round((agent.tokensSpent / Math.max(agent.tokensSpent + agent.tokensRemaining, 1)) * 100);
            const barColor =
              agent.tokensRemaining > 50
                ? "bg-emerald-500"
                : agent.tokensRemaining > 20
                  ? "bg-amber-500"
                  : "bg-red-500";

            return (
              <div key={agent.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {agent.name}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        agent.tokensRemaining > 50
                          ? "text-emerald-600"
                          : agent.tokensRemaining > 20
                            ? "text-amber-600"
                            : "text-red-600"
                      )}
                    >
                      {agent.tokensRemaining}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      remaining ({agent.tokensSpent} spent)
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      barColor
                    )}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>{agent.postsGenerated} posts</span>
                  <span>{agent.totalActions} total actions</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
