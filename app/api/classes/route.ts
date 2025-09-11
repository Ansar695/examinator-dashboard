import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get("boardId")

    const classes = await prisma.class.findMany({
      where: boardId ? { boardId } : undefined,
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
