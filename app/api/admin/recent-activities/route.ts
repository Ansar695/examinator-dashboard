import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    const lastFivePapers = await prisma.generatedPaper.findMany({
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

    const latestSubscription = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        planType: true,
        monthlyLimit: true,
        renewalDate: true,
        createdAt: true,
      },
    });

    const recentPapers = lastFivePapers.map((paper) => ({
      id: paper.id,
      type: "chapter" as const,
      title: paper.title,
      createdAt: paper.createdAt.toISOString(),
    }));

    // Return both results
    return NextResponse.json({
      status: 200,
      data: {
        recentPapers,
        latestSubscription,
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
