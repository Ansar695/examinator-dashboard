import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const subjectId = searchParams.get("subjectId")

    const where: any = {}
    if (classId) where.classId = classId
    if (subjectId) where.subjectId = subjectId

    const chapters = await prisma.chapter.findMany({
      where,
      include: {
        class: true,
        subject: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(chapters)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, pdfUrl, classId, subjectId, slug: customSlug, chapterNumber } = body

    const slug = customSlug || generateSlug(name)

    const chapter = await prisma.chapter.create({
      data: {
        name,
        slug,
        pdfUrl,
        chapterNumber,
        classId,
        subjectId,
      },
      include: {
        class: true,
        subject: true,
      },
    })

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 })
  }
}
