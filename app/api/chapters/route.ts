import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classSlug = searchParams.get("classSlug")
    const subjectSlug = searchParams.get("subjectSlug")

    if(!subjectSlug) {
      return NextResponse.json({ error: "subjectSlug is required" }, { status: 400 })
    }

    const subject = await prisma.subject.findUnique({ where: { slug: subjectSlug }, select: {id: true} })
    let classInfo = null
    if (classSlug) {
      classInfo = await prisma.class.findUnique({ where: { slug: classSlug }, select: {id: true} })
    }

    const where: any = {}
    if (classInfo) where.classId = classInfo?.id
    if (subject) where.subjectId = subject?.id

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
