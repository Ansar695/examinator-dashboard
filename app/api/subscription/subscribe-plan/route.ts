import { PrismaClient, type PlanType } from "@prisma/client";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { addUsageToHistory } from "@/lib/auth/plansMiddleware";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok || !auth?.userId) return auth.response;

    const { planType } = await req.json();
    if (planType !== "FREE")
      return Response.json(
        {
          error:
            "Only FREE plan can be subscribed currently, Other plans are coming soon",
            status: 400,
            success: false,
        },
        { status: 400 }
      );

    const subscription = await subscribePlan(auth?.userId, planType);

    return Response.json({
      subscription,
      success: true,
      message: "Plan upgraded successfully",
      status: 200,
    }, { status: 200 });
  } catch (error) {
    console.error("Error upgrading plan:", error);
    return Response.json({ error: "Internal server error", status: 500 }, { status: 500 });
  }
}

export const subscribePlan = async (userId: string, planType: PlanType) => {
  const planConfig: Record<PlanType, { limit: number; price: number }> = {
    FREE: { limit: 3, price: 0 },
    STANDARD: { limit: 45, price: 2000 },
    PREMIUM: { limit: 100, price: 4000 },
  };

  const config = planConfig[planType as PlanType];

  const isPlanExists = await prisma.subscription.findUnique({
    where: { userId: userId },
  });

  const now = new Date();

  if (
    isPlanExists &&
    isPlanExists.planType === "FREE" &&
    planType === "FREE" &&
    isPlanExists.renewalDate > now
  ) {
    throw new Error(
      "Your FREE plan is already active. You can renew after it expires."
    );
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId: userId },
    update: {
      planType,
      monthlyLimit: config.limit,
      pricePerMonth: config.price,
      papersGenerated: 0,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: userId,
      planType,
      monthlyLimit: config.limit,
      pricePerMonth: config.price,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  if (!subscription) {
    throw new Error("Subscription failed");
  }

  if (isPlanExists) {
    await addUsageToHistory(userId, subscription);
  }

  return subscription;
};
