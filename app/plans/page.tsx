"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useSubscribePlanMutation } from "@/lib/api/plansApi";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PLANS, PlanType } from "@/utils/static/plans";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PlanCard } from "@/components/shared/PlanCard";

export default function Plans() {
  const router = useRouter();

  const [subscribePlan, { isLoading, error }] = useSubscribePlanMutation();

  const handleSubscribe = async (planType: PlanType) => {
      try {
        const response = await subscribePlan({ planType }).unwrap();
        console.log("Subscription response:", response);
        if (response.success) {
          toast({
            title: `Congratulations!`,
            description: `You have successfully subscribed to the ${planType?.toLocaleLowerCase()} plan. Redirecting...`,
          });
          router.push(`/select-board`);
        }else{
          toast({
            title: "Error",
            description: response?.message || "Failed to subscribe to the selected plan. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Subscription failed:", err);
        toast({
          title: "Error",
          description:
            "Failed to subscribe to the selected plan. Please try again later OR contact support team.",
          variant: "destructive",
        });
      }
    }

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:
          "Failed to subscribe to the selected plan. Please try again later.",
      });
    }
  }, [error]);

  return (
    <MainLayout>
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
            {PLANS?.map((plan, i) => (
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
