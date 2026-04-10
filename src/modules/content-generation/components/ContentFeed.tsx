"use client";

import {
  MessageSquare,
  Image,
  Palette,
  User,
  MapPin,
  Rss,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetContentFeedQuery } from "@/lib/api/contentApi";

const audienceColors: Record<string, string> = {
  buyer: "bg-emerald-100 text-emerald-800",
  seller: "bg-blue-100 text-blue-800",
  investor: "bg-violet-100 text-violet-800",
};

const toneColors: Record<string, string> = {
  luxury: "bg-amber-100 text-amber-800",
  friendly: "bg-sky-100 text-sky-800",
  bold: "bg-red-100 text-red-800",
  professional: "bg-slate-100 text-slate-800",
  modern: "bg-violet-100 text-violet-800",
  warm: "bg-orange-100 text-orange-800",
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

export default function ContentFeed() {
  const { data, isLoading } = useGetContentFeedQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="mb-3 h-4 w-40" />
              <Skeleton className="mb-2 h-16 w-full" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Rss className="size-6 text-primary" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          No content yet
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Generate your first post to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-5">
            {/* Header row */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3" />
                <span className="font-medium text-foreground">
                  {item.agent.name}
                </span>
              </div>
              <Badge
                className={
                  audienceColors[item.audience] ||
                  "bg-slate-100 text-slate-800"
                }
              >
                {item.audience}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {item.city}
              </div>
              <Badge
                className={
                  toneColors[item.brandTone] || "bg-slate-100 text-slate-800"
                }
              >
                <Palette className="mr-1 size-3" />
                {item.brandTone}
              </Badge>
              <span className="ml-auto text-[11px] text-muted-foreground">
                {formatDate(item.createdAt)}
              </span>
            </div>

            {/* Caption */}
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="size-3" />
                Caption
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {item.caption}
              </p>
            </div>

            {/* Image Prompt */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <Image className="size-3" />
                Image Prompt
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.imagePrompt}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
