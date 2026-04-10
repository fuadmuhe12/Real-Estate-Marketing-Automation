"use client";

import { useState } from "react";
import { Sparkles, Flame, Snowflake, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeadsQuery } from "@/lib/api/leadsApi";
import type { Lead } from "@/lib/api/leadsApi";
import SendToAiDialog from "./SendToAiDialog";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  hot: { label: "Hot", className: "bg-amber-100 text-amber-800", icon: Flame },
  new: { label: "New", className: "bg-emerald-100 text-emerald-800", icon: UserPlus },
  cold: { label: "Cold", className: "bg-sky-100 text-sky-800", icon: Snowflake },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

interface LeadsListProps {
  statusFilter: string | undefined;
}

export default function LeadsList({ statusFilter }: LeadsListProps) {
  const { data, isLoading } = useGetLeadsQuery(statusFilter);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <p className="text-sm text-muted-foreground">No leads found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Last Contacted</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((lead) => {
              const config = statusConfig[lead.status] || statusConfig.new;
              const StatusIcon = config.icon;
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {lead.phone}
                  </TableCell>
                  <TableCell>
                    <Badge className={config.className}>
                      <StatusIcon className="mr-1 size-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(lead.lastContacted)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Sparkles className="size-3.5" />
                      Send to AI
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {data.map((lead) => {
          const config = statusConfig[lead.status] || statusConfig.new;
          const StatusIcon = config.icon;
          return (
            <div
              key={lead.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{lead.name}</p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                    {lead.phone}
                  </p>
                </div>
                <Badge className={config.className}>
                  <StatusIcon className="mr-1 size-3" />
                  {config.label}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(lead.lastContacted)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLead(lead)}
                >
                  <Sparkles className="size-3.5" />
                  Send to AI
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      {selectedLead && (
        <SendToAiDialog
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => {
            if (!open) setSelectedLead(null);
          }}
        />
      )}
    </>
  );
}
