"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Rss,
  Users,
  Zap,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TokenDisplay from "@/modules/tokens/components/TokenDisplay";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/activity", label: "Activity", icon: Zap },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
          <Bot className="size-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-white">
            AgentAI
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
            automation
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-l-2 border-emerald-500 bg-sidebar-accent text-white"
                      : "border-l-2 border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500 group-hover:text-slate-400"
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-border" />

      {/* Token Display */}
      <TokenDisplay />
    </aside>
  );
}
