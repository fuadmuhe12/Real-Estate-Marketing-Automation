"use client";

import ContentFeed from "@/modules/content-generation/components/ContentFeed";

export default function FeedPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Content Feed
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all previously generated content.
        </p>
      </div>

      <ContentFeed />
    </div>
  );
}
