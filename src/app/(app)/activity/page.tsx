"use client";

import { Zap } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Activity
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Automation log of all AI-triggered actions.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Zap className="size-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          Activity log coming in Phase 4
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Timeline of posts simulated, follow-ups, and call triggers
        </p>
      </div>
    </div>
  );
}
