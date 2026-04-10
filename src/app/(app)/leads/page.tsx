"use client";

import { useState } from "react";
import LeadFilters from "@/modules/crm/components/LeadFilters";
import LeadsList from "@/modules/crm/components/LeadsList";

export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leads
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your CRM leads and send AI follow-ups.
          </p>
        </div>
        <LeadFilters active={statusFilter} onChange={setStatusFilter} />
      </div>

      <LeadsList statusFilter={statusFilter} />
    </div>
  );
}
