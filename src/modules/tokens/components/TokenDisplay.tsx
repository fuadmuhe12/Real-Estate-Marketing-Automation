"use client";

import { Coins } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useGetAgentTokensQuery } from "@/lib/api/metricsApi";
import { cn } from "@/lib/utils";

export default function TokenDisplay() {
  const activeAgent = useAppSelector((s) => s.token.activeAgentName);
  const { data, isLoading } = useGetAgentTokensQuery(activeAgent, {
    skip: !activeAgent,
  });

  const tokens = data?.tokens ?? 0;
  const max = 100;
  const pct = Math.round((tokens / max) * 100);

  const barColor =
    pct > 50
      ? "bg-emerald-500"
      : pct > 20
        ? "bg-amber-500"
        : "bg-red-500";

  const textColor =
    pct > 50
      ? "text-emerald-400"
      : pct > 20
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="mx-3 mb-3 rounded-lg bg-white/[0.06] p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-emerald-500/20">
          <Coins className="size-3.5 text-emerald-400" />
        </div>
        <span className="text-xs font-medium text-slate-300 truncate">
          {activeAgent}
        </span>
      </div>

      {isLoading ? (
        <div className="h-8 animate-pulse rounded bg-white/10" />
      ) : (
        <>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className={cn("text-lg font-bold tabular-nums", textColor)}>
              {tokens}
            </span>
            <span className="text-[11px] text-slate-500">/ {max} tokens</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                barColor
              )}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-1.5 text-[11px] text-slate-500">
            {pct}% remaining
          </p>
        </>
      )}
    </div>
  );
}
