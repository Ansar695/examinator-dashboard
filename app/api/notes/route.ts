import { requireAuth } from "@/lib/auth/authMiddleware"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")

    const whereClause: any = {}
    if (classId) {
      whereClause.classId = classId
    }

    const notes = await prisma.importantNotes.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: notes }, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch notes",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response

    const body = await request.json()
    const { notesTitle, classId, boardId, file, userType } = body

    // Validation
    if (!notesTitle || notesTitle.trim().length < 3) {
      return NextResponse.json({ success: false, message: "Note title must be at least 3 characters" }, { status: 422 })
    }

    if (!classId || !boardId) {
      return NextResponse.json({ success: false, message: "Class and Board IDs are required" }, { status: 422 })
    }

    if (!file) {
      return NextResponse.json({ success: false, message: "PDF file is required" }, { status: 422 })
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!classExists) {
      return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 })
    }

    const note = await prisma.importantNotes.create({
      data: {
        notesTitle,
        classId,
        file,
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
    })

    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating note:", error)

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "Note already exists",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to create note",
      },
      { status: 500 },
    )
  }
}
