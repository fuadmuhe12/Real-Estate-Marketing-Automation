"use client";

import { useState } from "react";
import { Copy, Check, Image, MessageSquare, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface ContentResultProps {
  caption: string;
  imagePrompt: string;
  brandTone: string;
}

const toneColors: Record<string, string> = {
  luxury: "bg-amber-100 text-amber-800",
  friendly: "bg-sky-100 text-sky-800",
  bold: "bg-red-100 text-red-800",
  professional: "bg-slate-100 text-slate-800",
  modern: "bg-violet-100 text-violet-800",
  warm: "bg-orange-100 text-orange-800",
};

export default function ContentResult({
  caption,
  imagePrompt,
  brandTone,
}: ContentResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Generated Content
            </h3>
            <Badge
              className={
                toneColors[brandTone] || "bg-slate-100 text-slate-800"
              }
            >
              <Palette className="mr-1 size-3" />
              {brandTone}
            </Badge>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageSquare className="size-3" />
              Social Media Caption
            </div>
            <div className="relative rounded-lg bg-muted/50 p-3">
              <p className="pr-8 text-sm leading-relaxed text-foreground">
                {caption}
              </p>
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Image Prompt */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Image className="size-3" />
              Image Prompt
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {imagePrompt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
