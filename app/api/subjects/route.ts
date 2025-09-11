import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardId = searchParams.get("boardId")
    const classId = searchParams.get("classId")

    const where: any = {}
    if (boardId) where.boardId = boardId
    if (classId) where.classId = classId

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        board: true,
        class: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, boardId, classId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const subject = await prisma.subject.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        boardId,
        classId,
      },
      include: {
        board: true,
        class: true,
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
