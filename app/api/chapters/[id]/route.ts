import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, chapterNumber, pdfUrl, classId, subjectId, slug: customSlug } = body

    const slug = customSlug || generateSlug(name)

    const chapter = await prisma.chapter.update({
      where: { id: params.id },
      data: {
        name,
        chapterNumber,
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
    const id = params.id

    // Prisma MongoDB expects a 24-char hex ObjectId string.
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid chapter id" }, { status: 400 })
    }

    const existing = await prisma.chapter.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // In Prisma's Mongo relation mode, deleting a Chapter that has related Questions
    // can fail because those relations are required. Delete dependents first.
    await prisma.$transaction([
      prisma.mCQQuestion.deleteMany({ where: { chapterId: id } }),
      prisma.shortQuestion.deleteMany({ where: { chapterId: id } }),
      prisma.longQuestion.deleteMany({ where: { chapterId: id } }),
      prisma.chapter.delete({ where: { id } }),
    ])

    return NextResponse.json({ message: "Chapter deleted successfully" })
  } catch (error) {
    console.error("Delete chapter error:", error)
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 })
  }
}
