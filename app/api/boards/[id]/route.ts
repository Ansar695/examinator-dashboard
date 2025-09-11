import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: {
        classes: true,
        subjects: true,
      },
    })

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 })
    }

    return NextResponse.json(board)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch board" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, logoUrl, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const board = await prisma.board.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        logoUrl,
      },
    })

    return NextResponse.json(board)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.board.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Board deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 })
  }
}
