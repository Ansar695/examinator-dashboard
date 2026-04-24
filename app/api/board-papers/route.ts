import { requireAuth } from "@/lib/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);

    const boardName = searchParams.get("boardName") || "";
    const boardYear = searchParams.get("boardYear") || "";
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // ✅ Filters
    const whereClause: any = {};

    if (boardName && boardName !== "all" && boardName !== undefined) {
      whereClause.boardName = boardName;
    }

    if (boardYear && boardYear !== "all" && boardYear !== undefined) {
      whereClause.boardYear = boardYear;
    }

    if (search) {
      whereClause.OR = [
        { boardName: { contains: search, mode: "insensitive" } },
        { paperFile: { contains: search, mode: "insensitive" } },
      ];
    }

    // ✅ Pagination setup
    const skip = (page - 1) * limit;

    // ✅ Fetch total count first for meta
    const total = await prisma.boardPapers.count({
      where: whereClause,
    });

    // ✅ Fetch paginated data
    const boardPapers = await prisma.boardPapers.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // ✅ Meta info for frontend
    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    return NextResponse.json(
      { success: true, data: boardPapers, meta },
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

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { boardName, boardYear, paperFile, fileSize } = body;

    // Validation
    if (!boardName || !boardYear) {
      return NextResponse.json(
        { success: false, message: "Board name and year is required." },
        { status: 422 }
      );
    }

    if (!paperFile) {
      return NextResponse.json(
        { success: false, message: "Paper file is required" },
        { status: 422 }
      );
    }

    const boardPaper = await prisma.boardPapers.create({
      data: {
        boardName,
        boardYear,
        paperFile,
        fileSize: fileSize,
      },
    });

    return NextResponse.json(
      { success: true, data: boardPaper },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating board paper:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "Board paper already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to create board paper",
      },
      { status: 500 }
    );
  }
}
