import { Star, Zap, Crown } from "lucide-react";

export type PlanType = "FREE" | "STANDARD" | "PREMIUM";

export type Plan = {
  name: string;
  type: PlanType;
  icon: typeof Star | typeof Zap | typeof Crown;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
  gradient: string;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    type: "FREE",
    icon: Star,
    price: "0",
    period: "month",
    description: "Perfect for trying out our platform",
    features: [
      "3 papers per month",
      "100 questions per paper",
      "Basic templates (2)",
      "Standard support",
      "Watermark on papers",
    ],
    limitations: ["No AI recommendations", "Limited exports"],
    cta: "Start Free",
    popular: false,
    gradient: "from-muted to-muted/50",
  },
  {
    name: "Standard",
    type: "STANDARD",
    icon: Zap,
    price: "2000",
    period: "month",
    description: "Best for individual teachers",
    features: [
      "45 papers",
      "Unlimited questions",
      "All 6+ templates",
      "Priority support",
      "No watermark",
      "AI recomendations",
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
    price: "4000",
    period: "month",
    description: "For schools and institutions",
    features: [
      "100 papers",
      "Custom branding",
      "Dedicated support",
      "API access",
      "Custom templates",
      "Analytics dashboard",
      "Team collaboration",
      "Priority support",
      "No watermark",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-accent/20 to-primary/20",
  },
];


