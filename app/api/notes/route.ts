import { requireAuth } from "@/lib/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { broadcastToTeachers } from "@/lib/notifications/notificationService";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);

    // ✅ Query params
    const classId = searchParams.get("classId");
    const userType = searchParams.get("userType");
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // ✅ Filters
    const whereClause: any = {};
    if (classId && classId !== undefined && classId !== 'all') whereClause.classId = classId;

    if (userType && userType !== "all") {
      whereClause.userType = userType?.toUpperCase()
    }

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

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { notesTitle, classId, boardId, file, userType, fileSize } = body;

    // Validation
    if (!notesTitle || notesTitle.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "Note title must be at least 3 characters" },
        { status: 422 }
      );
    }

    if (!classId || !boardId) {
      return NextResponse.json(
        { success: false, message: "Class and Board IDs are required" },
        { status: 422 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 422 }
      );
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    }

    const note = await prisma.importantNotes.create({
      data: {
        notesTitle,
        classId,
        boardId,
        file,
        fileSize: fileSize,
        userType: userType || "STUDENT",
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if ((userType || "STUDENT")?.toUpperCase?.() === "TEACHER") {
      try {
        await broadcastToTeachers({
          type: "INFO",
          title: "New important note",
          message: `${notesTitle} has been shared for teachers.`,
          href: "/teacher/important-notes",
          metadata: { noteId: note.id, classId, boardId },
        });
      } catch (notificationError) {
        console.error("Failed to broadcast notification (important notes):", notificationError);
      }
    }

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating note:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "Note already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to create note",
      },
      { status: 500 }
    );
  }
}
