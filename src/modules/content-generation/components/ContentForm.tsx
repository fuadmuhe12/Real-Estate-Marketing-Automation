"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useGenerateContentMutation } from "@/lib/api/contentApi";
import { useGetAgentsQuery } from "@/lib/api/metricsApi";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setActiveAgent } from "@/lib/store/tokenSlice";
import { appToast } from "@/lib/appToast";
import BuyTokensModal from "@/modules/tokens/components/BuyTokensModal";

const schema = z.object({
  agentName: z.string().min(1, "Select an agent"),
  audience: z.enum(["buyer", "seller", "investor"], {
    message: "Select a target audience",
  }),
  city: z.string().min(1, "City is required"),
});

type FormData = z.infer<typeof schema>;

interface ContentFormProps {
  onGenerated?: (result: {
    caption: string;
    imagePrompt: string;
    brandTone: string;
    tokens: number;
  }) => void;
}

export default function ContentForm({ onGenerated }: ContentFormProps) {
  const dispatch = useAppDispatch();
  const activeAgent = useAppSelector((s) => s.token.activeAgentName);
  const { data: agents } = useGetAgentsQuery();
  const [generateContent, { isLoading }] = useGenerateContentMutation();
  const [showBuyTokens, setShowBuyTokens] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      agentName: activeAgent,
      audience: undefined,
      city: "",
    },
  });

  const selectedAgentName = watch("agentName");
  const selectedAgent = agents?.find((a) => a.name === selectedAgentName);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await generateContent(data).unwrap();
      if (data.agentName !== activeAgent) {
        dispatch(setActiveAgent(data.agentName));
      }
      appToast.success("Content generated successfully!");
      onGenerated?.({
        caption: result.content.caption,
        imagePrompt: result.content.imagePrompt,
        brandTone: result.content.brandTone,
        tokens: result.tokens,
      });
    } catch (err: unknown) {
      const error = err as { data?: { error?: string }; status?: number };
      if (error?.status === 403) {
        setShowBuyTokens(true);
      } else {
        appToast.error(
          typeof error?.data?.error === "string"
            ? error.data.error
            : "Failed to generate content."
        );
      }
    }
  };

  return (
    <>
    <Card>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Agent Name */}
          <div className="space-y-1.5">
            <Label htmlFor="agentName" className="text-sm font-medium">
              Agent Name
            </Label>
            <Input
              id="agentName"
              list="agentSuggestions"
              placeholder="e.g. Sarah Johnson"
              autoComplete="off"
              {...register("agentName")}
            />
            <datalist id="agentSuggestions">
              {agents?.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.tokens} tokens
                </option>
              ))}
            </datalist>
            {selectedAgent && selectedAgent.tokens < 5 && (
              <p className="text-xs text-destructive">
                This agent only has {selectedAgent.tokens} tokens (5 required)
              </p>
            )}
            {!selectedAgent && selectedAgentName && (
              <p className="text-xs text-muted-foreground">
                New agent — will start with 100 tokens
              </p>
            )}
            {errors.agentName && (
              <p className="text-xs text-destructive">
                {errors.agentName.message}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <Label htmlFor="audience" className="text-sm font-medium">
              Target Audience
            </Label>
            <select
              id="audience"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("audience")}
              defaultValue=""
            >
              <option value="" disabled>
                Select audience...
              </option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="investor">Investor</option>
            </select>
            {errors.audience && (
              <p className="text-xs text-destructive">
                {errors.audience.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              placeholder="e.g. Miami, Austin, New York"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-xs text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* Token cost hint */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coins className="size-3" />
            <span>This will cost 5 tokens</span>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isLoading ? "Generating..." : "Generate Content"}
          </Button>
        </form>
      </CardContent>
    </Card>
    <BuyTokensModal open={showBuyTokens} onOpenChange={setShowBuyTokens} />
    </>
  );
}
