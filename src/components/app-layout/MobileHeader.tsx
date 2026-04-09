"use client";

import { Bot, Coins } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useGetAgentTokensQuery } from "@/lib/api/metricsApi";
import { cn } from "@/lib/utils";

export default function MobileHeader() {
  const activeAgent = useAppSelector((s) => s.token.activeAgentName);
  const { data } = useGetAgentTokensQuery(activeAgent, {
    skip: !activeAgent,
  });

  const tokens = data?.tokens ?? 0;
  const textColor =
    tokens > 50
      ? "text-emerald-500"
      : tokens > 20
        ? "text-amber-500"
        : "text-red-500";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500">
          <Bot className="size-3.5 text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground">
          AgentAI
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Coins className={cn("size-3.5", textColor)} />
        <span className={cn("text-xs font-semibold tabular-nums", textColor)}>
          {tokens}
        </span>
        <span className="text-[10px] text-muted-foreground">tokens</span>
      </div>
    </header>
  );
}
