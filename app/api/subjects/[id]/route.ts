import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, boardId, classId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const subject = await prisma.subject.update({
      where: { id: params.id },
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

    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.subject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}
