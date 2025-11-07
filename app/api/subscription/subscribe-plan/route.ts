import { PrismaClient, type PlanType } from "@prisma/client";
import { requireAuth } from "@/lib/auth/authMiddleware";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok || !auth?.userId) return auth.response;

    const { planType } = await req.json();
    if (planType !== "FREE")
      return Response.json(
        { error: "Only FREE plan can be subscribed currently, Other plans are coming soon" },
        { status: 400 }
      );

    const planConfig: Record<PlanType, { limit: number; price: number }> = {
      FREE: { limit: 3, price: 0 },
      STANDARD: { limit: 45, price: 2000 },
      PREMIUM: { limit: 100, price: 4000 },
    };

    if (!planConfig[planType as PlanType]) {
      return Response.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const config = planConfig[planType as PlanType];

    const subscription = await prisma.subscription.upsert({
      where: { userId: auth?.userId },
      update: {
        planType,
        monthlyLimit: config.limit,
        pricePerMonth: config.price,
        papersGenerated: 0,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId: auth?.userId,
        planType,
        monthlyLimit: config.limit,
        pricePerMonth: config.price,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return Response.json({
      subscription,
      message: "Plan upgraded successfully",
    });
  } catch (error) {
    console.error("Error upgrading plan:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
