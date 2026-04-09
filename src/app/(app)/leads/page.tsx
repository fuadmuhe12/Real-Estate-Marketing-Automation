"use client";

import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your CRM leads and send AI follow-ups.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Users className="size-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          Lead management coming in Phase 3
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Filter by status, send leads to AI, log actions
        </p>
      </div>
    </div>
  );
}
