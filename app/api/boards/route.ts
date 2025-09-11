import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(boards)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, logoUrl, slug: customSlug } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 })
    }

    if (name.length > 100) {
      return NextResponse.json({ error: "Board name must be less than 100 characters" }, { status: 400 })
    }

    const slug = customSlug || generateSlug(name)

    if (!slug || slug.trim() === "") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const existingBoard = await prisma.board.findUnique({
      where: { slug },
    })

    if (existingBoard) {
      return NextResponse.json({ error: "A board with this slug already exists" }, { status: 400 })
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        logoUrl: logoUrl || null,
      },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error("Board creation error:", error)
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 })
  }
}
