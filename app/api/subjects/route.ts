import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const boardSlug = searchParams.get("boardSlug")
    const classSlug = searchParams.get("classSlug")

    if(!classSlug && !boardSlug) {
      return NextResponse.json({ error: "At least one of boardSlug or classSlug is required" }, { status: 400 })
    }

    const board = await prisma.board.findUnique({ where: { slug: boardSlug || "" }, select: {id: true} })
    const classInfo = await prisma.class.findUnique({ where: { slug: classSlug || "" }, select: {id: true} })


    if(!board && !classInfo) {
      return NextResponse.json({ error: "This Board and Class does not exist" }, { status: 400 })
    }

    const where: any = {}
    if (board) where.boardId = board?.id
    if (classInfo) where.classId = classInfo?.id

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
