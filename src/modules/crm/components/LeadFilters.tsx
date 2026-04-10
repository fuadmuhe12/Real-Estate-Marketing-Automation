"use client";

import { Flame, Users, Snowflake, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
  { value: undefined, label: "All", icon: Users },
  { value: "new", label: "New", icon: UserPlus },
  { value: "hot", label: "Hot", icon: Flame },
  { value: "cold", label: "Cold", icon: Snowflake },
] as const;

interface LeadFiltersProps {
  active: string | undefined;
  onChange: (value: string | undefined) => void;
}

export default function LeadFilters({ active, onChange }: LeadFiltersProps) {
  return (
    <div className="flex gap-1.5">
      {filters.map((f) => {
        const isActive = active === f.value;
        const Icon = f.icon;
        return (
          <button
            key={f.label}
            onClick={() => onChange(f.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-3",
                f.value === "hot" && isActive && "text-amber-200",
                f.value === "hot" && !isActive && "text-amber-500"
              )}
            />
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
