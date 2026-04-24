import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if(!params.id) return NextResponse.json(
      { error: "Chapter Id not found", status: 422 },
      { status: 422 }
    );

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const subTopic = searchParams.get("subTopic")

    // Get total count for pagination
    const totalCount = await prisma.longQuestion.count({
      where: {
        chapterId: params.id,
        isActive: true,
        ...(subTopic ? { subTopic } : {}),
      }
    })

    // Get paginated questions
    const longQuestions = await prisma.longQuestion.findMany({
      where: {
        chapterId: params.id,
        isActive: true,
        ...(subTopic ? { subTopic } : {}),
      },
      include: {
        chapter: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      data: longQuestions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching long questions:", error)
    return NextResponse.json({ error: "Failed to fetch long questions" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    if(!params.id) return NextResponse.json(
          { error: "Question Id not found", status: 422 },
          { status: 422 }
        );

    const longQuestion = await prisma.longQuestion.update({
      where: { id: params.id },
      data: body,
      include: {
        chapter: true,
      },
    })

    return NextResponse.json(longQuestion, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: "Failed to update long question" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if(!params.id) return NextResponse.json(
          { error: "Question Id not found", status: 422 },
          { status: 422 }
        );
  try {
    await prisma.longQuestion.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Long question deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete long question" }, { status: 500 })
  }
}
