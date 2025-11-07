"use client"

import { MainLayout } from "@/components/layout/main-layout"
import CustomSpinner from "@/components/shared/CustomSpinner";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast';
import { useSubscribePlanMutation } from "@/lib/api/plansApi"
import { Check, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function Plans() {
  const { toast } = useToast();
  const router = useRouter()

  const plans = [
    {
      name: "Free",
      type: "FREE",
      icon: Star,
      price: "0",
      period: "forever",
      description: "Perfect for trying out our platform",
      features: [
        "5 papers per month",
        "100 questions per paper",
        "Basic templates (2)",
        "Standard support",
        "Watermark on papers",
      ],
      limitations: ["No AI recommendations", "No custom templates", "Limited exports"],
      cta: "Start Free",
      popular: false,
      gradient: "from-muted to-muted/50",
    },
    {
      name: "Standard",
      type: "STANDARD",
      icon: Zap,
      price: "29",
      period: "month",
      description: "Best for individual teachers",
      features: [
        "Unlimited papers",
        "Unlimited questions",
        "All 6+ templates",
        "Priority support",
        "No watermark",
        "AI question suggestions",
        "Custom paper headers",
        "Export to PDF/Word",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-primary/20 to-secondary/20",
    },
    {
      name: "Premium",
      type: "PREMIUM",
      icon: Crown,
      price: "99",
      period: "month",
      description: "For schools and institutions",
      features: [
        "Everything in Pro",
        "Multi-user accounts (10+)",
        "Custom branding",
        "Dedicated support",
        "API access",
        "Custom templates",
        "Analytics dashboard",
        "Team collaboration",
        "Bulk paper generation",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-accent/20 to-primary/20",
    },
  ]
  const [subscribePlan, { isLoading, error }] = useSubscribePlanMutation();

  const handleSubscribe = async (planType: string) => {
    try {
      const response = await subscribePlan({ planType }).unwrap();
      console.log("Subscription successful:", response);
      if (response.success && response.data) {
          toast({
            title: 'Paper created successfully',
            description: 'Redirecting to paper preview...',
          });
          router.push(`/select-board`);
        }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };


  return (
    <MainLayout>
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">Start free and upgrade as you grow</p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-scale-in ${
                plan.popular ? "border-2 border-primary shadow-xl" : ""
              } bg-gradient-to-br ${plan.gradient}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex w-16 h-16 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient} mb-4`}
                >
                  <plan.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t space-y-3">
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start gap-3 opacity-50">
                        <span className="text-sm line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/select-board">
                <Button
                  className={`w-full py-6 text-lg transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan?.type)}
                  disabled={isLoading}
                >
                  {isLoading ? <CustomSpinner /> : plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-3xl font-bold mb-4">All plans include</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
            {["Punjab Board templates", "Question bank access", "Paper customization", "24/7 support access"].map(
              (item, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Check className="h-5 w-5 text-secondary" />
                  <span className="text-sm">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  )
}
