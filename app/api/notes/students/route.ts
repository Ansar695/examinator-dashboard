import { requireAuth } from "@/lib/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);

    // ✅ Query params
    const classId = searchParams.get("classId");
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // ✅ Filters
    const whereClause: any = {userType: "STUDENT"};
    if (classId && classId !== undefined && classId !== 'all') whereClause.classId = classId;

    if (search) {
      whereClause.OR = [
        { notesTitle: { contains: search, mode: "insensitive" } },
        { file: { contains: search, mode: "insensitive" } },
      ];
    }

    // ✅ Pagination setup
    const skip = (page - 1) * limit;

    // ✅ Fetch total count first for meta
    const total = await prisma.importantNotes.count({
      where: whereClause,
    });

    // ✅ Fetch paginated data
    const notes = await prisma.importantNotes.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        board: { select: { id: true, name: true } },
      },
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
      { success: true, data: notes, meta },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch notes",
      },
      { status: 500 }
    );
  }
}