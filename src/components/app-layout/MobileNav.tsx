"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Rss,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/activity", label: "Activity", icon: Zap },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sidebar-border bg-sidebar md:hidden">
      <ul className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-emerald-400"
                    : "text-slate-500 active:text-slate-300"
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {/* Safe area for phones with home indicators */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
