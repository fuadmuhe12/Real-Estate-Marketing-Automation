"use client";

import { useState } from "react";
import ContentForm from "@/modules/content-generation/components/ContentForm";
import ContentResult from "@/modules/content-generation/components/ContentResult";

interface GeneratedContent {
  caption: string;
  imagePrompt: string;
  brandTone: string;
  tokens: number;
}

export default function GeneratePage() {
  const [result, setResult] = useState<GeneratedContent | null>(null);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Generate Content
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create AI-powered social media content for your listings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentForm onGenerated={setResult} />
        {result && (
          <ContentResult
            caption={result.caption}
            imagePrompt={result.imagePrompt}
            brandTone={result.brandTone}
          />
        )}
      </div>
    </div>
  );
}
