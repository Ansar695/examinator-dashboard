import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, pdfUrl, classId, subjectId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const chapter = await prisma.chapter.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        pdfUrl,
        classId,
        subjectId,
      },
      include: {
        class: true,
        subject: true,
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.chapter.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Chapter deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 })
  }
}
