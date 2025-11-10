import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    // Count total generated papers
    const totalCount = await prisma.generatedPaper.count({
      where: { userId: auth.userId },
    });

    const currentPlan = await prisma.subscription.findUnique({
      where: { userId: auth.userId },
    });

    // Fetch last 5 generated papers (sorted by newest first)
    const lastFivePapers = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        subject: {
          select: {
            id: true,
            name: true,
            slug: true,
            class: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        board: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const stats = {
      totalPaper: currentPlan?.monthlyLimit || 0,
      usedPaper: totalCount,
      remainingPaper: currentPlan ? currentPlan.monthlyLimit - totalCount : 0,
      currentPlan: currentPlan?.planType || "FREE",
      expiryDate: currentPlan?.renewalDate || null,
      usedPercentage: currentPlan
        ? Math.min(
            Math.round((totalCount / currentPlan.monthlyLimit) * 100),
            100
          )
        : 0,
    };

    // Return both results
    return NextResponse.json({
      status: 200,
      data: {
        stats,
        papers: lastFivePapers,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
