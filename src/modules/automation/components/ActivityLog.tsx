"use client";

import {
  ImageIcon,
  MessageSquare,
  Phone,
  Zap,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAutomationLogQuery } from "@/lib/api/automationApi";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  string,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  post_simulated: {
    icon: ImageIcon,
    label: "Post Simulated",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  follow_up_generated: {
    icon: MessageSquare,
    label: "Follow-up Generated",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  call_triggered: {
    icon: Phone,
    label: "Call Triggered",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
};

const defaultConfig = {
  icon: Zap,
  label: "Action",
  color: "text-slate-600",
  bg: "bg-slate-100",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function ActivityLog({ limit }: { limit?: number }) {
  const { data, isLoading } = useGetAutomationLogQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit || 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = limit ? data?.slice(0, limit) : data;

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="size-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No activity yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Generate content or send leads to AI to see activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((log, i) => {
        const config = typeConfig[log.type] || defaultConfig;
        const Icon = config.icon;
        return (
          <div
            key={log.id}
            className={cn(
              "flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50",
              i !== items.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                config.bg
              )}
            >
              <Icon className={cn("size-4", config.color)} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold uppercase tracking-wider"
                >
                  {config.label}
                </Badge>
                {log.lead && (
                  <span className="text-xs text-muted-foreground">
                    &middot; {log.lead.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground line-clamp-2">
                {log.message}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  {log.agent.name}
                </span>
                <span>&middot;</span>
                <span>{formatDate(log.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
