import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    const questionType = searchParams.get("questionType");
    const chapterIds = searchParams.getAll("chapterIds");
    const parsedIds = JSON.parse(chapterIds as any);

    // Base filter
    const where: any = { isActive: true };

    if (parsedIds.length > 0) {
      where.chapterId = { in: parsedIds };
    }
    if (questionType) where.questionType = questionType.toUpperCase();

    const questions = await prisma.longQuestion.findMany({
      where: where,
      //   orderBy: [{ usageCount: "asc" }, { createdAt: "desc" }],
      include: {
        chapter: {
          select: {
            id: true,
            name: true,
            chapterNumber: true,
            subject: {
              select: {
                id: true,
                name: true,
                class: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      data: questions,
      pagination: {
        page,
        limit,
      },
      metadata: {
        algorithm: "usage-based-random",
        usageTracked: true,
      },
    });
  } catch (error) {
    console.error("Error fetching long questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
