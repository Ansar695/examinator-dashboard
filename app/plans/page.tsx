"use client";

import { MainLayout } from "@/components/layout/main-layout";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSubscribePlanMutation } from "@/lib/api/plansApi";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { PLANS, Plan, PlanType } from "@/utils/static/plans";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PlanCard } from "@/components/shared/PlanCard";

export default function Plans() {
  const router = useRouter();

  const [subscribePlan, { isLoading, error }] = useSubscribePlanMutation();

  const handleSubscribe = useCallback(
    async (planType: PlanType) => {
      try {
        const response = await subscribePlan({ planType }).unwrap();
        if (response.success && response.data) {
          toast({
            title: "Subscription updated",
            description: "Redirecting...",
          });
          router.push(`/select-board`);
        }
      } catch (err) {
        console.error("Subscription failed:", err);
      }
    },
    [router, subscribePlan, toast]
  );

  if (error) {
    toast({
      title: "Error",
      description: "Failed to subscribe to the selected plan. Please try again later.",
    });
  }

  return (
    <MainLayout>
      <Toaster />
      <div className="min-h-screen pt-16 bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Start free and upgrade as you grow
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <div
                key={plan.type}
                className="animate-scale-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <PlanCard
                  key={plan?.type}
                  plan={plan}
                  isLoading={isLoading}
                  onSelect={handleSubscribe}
                />
              </div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div
            className="mt-20 text-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="text-3xl font-bold mb-4">All plans include</h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
              {[
                "Punjab Board templates",
                "Question bank access",
                "Paper customization",
                "24/7 support access",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                >
                  <Check className="h-5 w-5 text-secondary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
