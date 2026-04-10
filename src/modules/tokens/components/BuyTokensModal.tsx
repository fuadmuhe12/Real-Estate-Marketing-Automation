"use client";

import { useState } from "react";
import {
  Coins,
  Loader2,
  Check,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { useRechargeTokensMutation } from "@/lib/api/metricsApi";
import { useAppSelector } from "@/lib/store/hooks";
import { appToast } from "@/lib/appToast";
import { cn } from "@/lib/utils";

const packages = [
  { amount: "25" as const, price: "$4.99", label: "Starter" },
  { amount: "50" as const, price: "$8.99", label: "Popular", popular: true },
  { amount: "100" as const, price: "$14.99", label: "Best Value" },
];

interface BuyTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuyTokensModal({
  open,
  onOpenChange,
}: BuyTokensModalProps) {
  const activeAgent = useAppSelector((s) => s.token.activeAgentName);
  const [selected, setSelected] = useState<"25" | "50" | "100">("50");
  const [step, setStep] = useState<"select" | "processing" | "success">(
    "select"
  );
  const [recharge] = useRechargeTokensMutation();

  const handlePurchase = async () => {
    setStep("processing");
    try {
      const res = await recharge({
        agentName: activeAgent,
        amount: selected,
      }).unwrap();
      setStep("success");
      appToast.success(`${res.purchased} tokens added! Balance: ${res.tokens}`);
      // Auto-close after showing success
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          setStep("select");
          setSelected("50");
        }, 200);
      }, 1500);
    } catch {
      setStep("select");
      appToast.error("Payment failed. Please try again.");
    }
  };

  const handleClose = () => {
    if (step === "processing") return; // Don't close during payment
    onOpenChange(false);
    setTimeout(() => {
      setStep("select");
      setSelected("50");
    }, 200);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {step === "select" && (
            <>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100">
                  <Coins className="size-4 text-amber-600" />
                </div>
                <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                  Buy Tokens
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Description className="mb-5 text-sm text-muted-foreground">
                You&apos;re out of tokens. Choose a package to continue.
              </DialogPrimitive.Description>

              <div className="space-y-2.5">
                {packages.map((pkg) => (
                  <button
                    key={pkg.amount}
                    onClick={() => setSelected(pkg.amount)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition-all",
                      selected === pkg.amount
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                        POPULAR
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          selected === pkg.amount
                            ? "bg-primary/10"
                            : "bg-muted"
                        )}
                      >
                        <Sparkles
                          className={cn(
                            "size-5",
                            selected === pkg.amount
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {pkg.amount} Tokens
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {pkg.label}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {pkg.price}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePurchase}>
                  <CreditCard className="size-4" />
                  Purchase
                </Button>
              </div>
            </>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="size-10 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-foreground">
                Processing payment...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Simulating secure transaction
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-8">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-7 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Payment Successful!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selected} tokens have been added to your account.
              </p>
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
