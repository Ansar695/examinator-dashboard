import { requireAuth } from "@/lib/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // ✅ Filters
    const whereClause: any = {};

    // ✅ Fetch paginated data
    const boardPapers = await prisma.boardPapers.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        boardName: true,
        id: true,
      }
    });

    return NextResponse.json(
      { success: true, data: boardPapers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching board papers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch board papers",
      },
      { status: 500 }
    );
  }
}