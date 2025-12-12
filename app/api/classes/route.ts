import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardSlug = searchParams.get("boardSlug")
    if (!boardSlug) {
      return NextResponse.json({ error: "boardSlug is required" }, { status: 400 })
    }
    const board = await prisma.board.findUnique({ where: { slug: boardSlug }, select: {id: true} })
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }
    console.log("Fetched board:", board)

    const classes = await prisma.class.findMany({
      where: board ? { boardId: board.id } : undefined,
      include: {
        board: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, boardId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const classData = await prisma.class.create({
      data: {
        name,
        slug,
        type,
        boardId,
      },
      include: {
        board: true,
      },
    })

    return NextResponse.json(classData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
