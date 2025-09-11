import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, type, boardId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const classData = await prisma.class.update({
      where: { id: params.id },
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

    return NextResponse.json(classData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.class.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
  }
}
