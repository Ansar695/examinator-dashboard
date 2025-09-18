import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/slugify"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    if(!params.id) return NextResponse.json(
          { error: "Question Id not found", status: 422 },
          { status: 422 }
        );

    const chapter = await prisma.mCQQuestion.update({
      where: { id: params.id },
      data: body,
      include: {
        chapter: true,
      },
    })

    return NextResponse.json(chapter, {status: 200})
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if(!params.id) return NextResponse.json(
          { error: "Question Id not found", status: 422 },
          { status: 422 }
        );
  try {
    await prisma.mCQQuestion.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Chapter deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 })
  }
}