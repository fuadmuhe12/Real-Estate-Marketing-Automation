"use client";

import { useState } from "react";
import { Loader2, Sparkles, Coins, MessageSquare } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSendLeadToAiMutation } from "@/lib/api/leadsApi";
import { useGetAgentsQuery } from "@/lib/api/metricsApi";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setActiveAgent } from "@/lib/store/tokenSlice";
import { appToast } from "@/lib/appToast";
import BuyTokensModal from "@/modules/tokens/components/BuyTokensModal";
import type { Lead } from "@/lib/api/leadsApi";

interface SendToAiDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SendToAiDialog({
  lead,
  open,
  onOpenChange,
}: SendToAiDialogProps) {
  const dispatch = useAppDispatch();
  const activeAgent = useAppSelector((s) => s.token.activeAgentName);
  const { data: agents } = useGetAgentsQuery();
  const [agentName, setAgentName] = useState(activeAgent);
  const [result, setResult] = useState<{ message: string; label: string } | null>(null);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [sendToAi, { isLoading }] = useSendLeadToAiMutation();

  const handleSend = async () => {
    if (!agentName) {
      appToast.error("Select an agent.");
      return;
    }

    try {
      const res = await sendToAi({
        leadId: lead.id,
        agentName,
      }).unwrap();
      setResult({ message: res.message, label: res.actionLabel });
      if (agentName !== activeAgent) {
        dispatch(setActiveAgent(agentName));
      }
      appToast.success(
        res.logType === "follow_up_generated"
          ? "Follow-up message generated!"
          : "Call trigger simulated!"
      );
    } catch (err: unknown) {
      const error = err as { status?: number; data?: { error?: string } };
      if (error?.status === 403) {
        setShowBuyTokens(true);
      } else {
        appToast.error(
          typeof error?.data?.error === "string"
            ? error.data.error
            : "Failed to send to AI."
        );
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setResult(null), 200);
  };

  const selectedAgent = agents?.find((a) => a.name === agentName);

  return (
    <>
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
            Send to AI
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
            Generate an AI follow-up for{" "}
            <span className="font-medium text-foreground">{lead.name}</span>
            {lead.status === "hot" && (
              <span className="ml-1 text-amber-500">(hot lead)</span>
            )}
          </DialogPrimitive.Description>

          <div className="mt-4 space-y-4">
            {!result ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="dialogAgentSelect" className="text-sm font-medium">
                    Select Agent
                  </Label>
                  <select
                    id="dialogAgentSelect"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {agents?.map((a) => (
                      <option key={a.name} value={a.name}>
                        {a.name} ({a.tokens} tokens)
                      </option>
                    ))}
                  </select>
                  {selectedAgent && selectedAgent.tokens < 10 && (
                    <p className="text-xs text-destructive">
                      This agent only has {selectedAgent.tokens} tokens (10 required)
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Coins className="size-3" />
                  <span>This will cost 10 tokens</span>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSend} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {isLoading ? "Generating..." : "Send to AI"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <MessageSquare className="size-3" />
                    {result.label}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">
                    {result.message}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleClose}>Done</Button>
                </div>
              </>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
    <BuyTokensModal open={showBuyTokens} onOpenChange={setShowBuyTokens} />
    </>
  );
}
