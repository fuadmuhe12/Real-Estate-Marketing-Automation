"use client";

import { FileText, Users, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMetricsQuery } from "@/lib/api/metricsApi";
import { motion } from "motion/react";

const cards = [
  { key: "postsGenerated" as const, label: "Posts Generated", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
  { key: "leadsContacted" as const, label: "Leads Contacted", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { key: "tokensUsed" as const, label: "Tokens Used", icon: Coins, color: "text-amber-600", bg: "bg-amber-100" },
];

export default function MetricCards() {
  const { data, isLoading } = useGetMetricsQuery();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.bg}`}
                >
                  <Icon className={`size-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold tabular-nums text-foreground">
                      {data?.[card.key] ?? 0}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
