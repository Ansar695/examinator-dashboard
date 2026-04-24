import { PrismaClient, type PlanType } from "@prisma/client";
import { requireAuth } from "@/lib/auth/authMiddleware";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok || !auth?.userId) return auth.response;

    const currentPlan = await prisma.subscription.findFirst({
      where: { userId: auth?.userId },
    });

    

    if(!currentPlan) return Response.json({ error: "No subscription plan found" }, { status: 404 });

    return Response.json({
      data: currentPlan,
      status: 200
    });
  } catch (error) {
    console.error("Error getting current plan:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
