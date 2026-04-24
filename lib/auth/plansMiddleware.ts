import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { prisma } from "../prisma";

export const currentPlanStatus = async () => {
  const session = await getServerSession(authOptions);

  try {
    const userPlan = await prisma.subscription.findUnique({
      where: {
        userId: session?.user.id,
      },
    });

    if (!userPlan)
      return { ok: false, code: "NO_SUB", message: "Please subscribe to a plan to create papers." };
    if (!userPlan.isActive) {
      return {
        ok: false,
        code: "DISABLED",
        message: "Your subscription is disabled. Please contact support for assistance.",
      };
    }
    const currentDate = new Date();

    if (
      userPlan?.planType === "FREE" &&
      userPlan.monthlyLimit <= userPlan?.papersGenerated
    ) {
      return { ok: false, code: "LIMIT_REACHED", message: "Your current plan has reached its monthly limit. Please upgrade your plan to continue creating papers." };
    } 
    
    if (
      userPlan.renewalDate > currentDate &&
      userPlan?.monthlyLimit <= userPlan.papersGenerated
    ) {
      return { ok: false, code: "LIMIT_REACHED", message: "Your current plan has reached its monthly limit. Please upgrade your plan to continue creating papers." };
    }

    return { ok: true, planType: userPlan.planType  };
  } catch (error) {
    console.error("Error in plan validation:", error);
    return { ok: false, code: "ERROR", message: "An error occurred while validating your plan. Please try again later OR contact support team."};
  }
};


export async function addUsageToHistory(userId: string, planData: any) {
  const now = new Date();
  const { month, year } = { month: now.getUTCMonth() + 1, year: now.getUTCFullYear() };

  // Find most relevant history doc for this active plan instance
  const candidate = await prisma.subscriptionHistory.findFirst({
    where: {
      userId,
      planType: planData?.planType,
      cycleStart: { lte: now },
      OR: [{ cycleEnd: null }, { cycleEnd: { gte: now } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (candidate) {
    // increment usage
    await prisma.subscriptionHistory.update({
      where: { id: candidate?.id },
      data: { papersGenerated: { increment: 1 } },
    });
    return;
  }

  // If not found, create a new history record for this plan instance
  await prisma.subscriptionHistory.create({
    data: {
      userId,
      month,
      year,
      planType: planData?.planType,
      monthlyLimit: planData?.monthlyLimit ?? 0,
      pricePerMonth: planData?.pricePerMonth ?? 0,
      planStatus: planData?.isActive ? "ACTIVE" : "INACTIVE",
      papersGenerated: 1,
      cycleStart: new Date(),
      cycleEnd: planData?.renewalDate ?? null,
    },
  });
}