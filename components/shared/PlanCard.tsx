import { Plan, PlanType } from "@/utils/static/plans";
import { Card } from "../ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomSpinner from "./CustomSpinner";

type PlanCardProps = {
  plan: Plan;
  isLoading: boolean;
  onSelect: (planType: PlanType) => void;
};

export async function PlanCard({ plan, isLoading, onSelect }: PlanCardProps) {
  return (
    <Card
      className={`relative p-8 transition-all duration-300 hover:shadow-xl ${
        plan.popular ? "border-2 border-primary shadow-xl" : ""
      } bg-gradient-to-br ${plan.gradient}`}
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
          <div className="pt-4 border-t space-y-3 opacity-70">
            {plan.limitations.map((limitation, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-sm line-through">{limitation}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/select-board">
        <Button
          className={`cursor-pointer w-full py-6 text-lg transition-all duration-300 hover:scale-105 ${
            plan.popular
              ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              : ""
          }`}
          variant={plan.popular ? "default" : "outline"}
          onClick={() => onSelect(plan.type)}
          disabled={isLoading}
        >
          {isLoading ? <CustomSpinner /> : plan.cta}
        </Button>
      </Link>
    </Card>
  );
}