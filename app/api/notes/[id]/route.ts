import { requireAuth } from "@/lib/auth/authMiddleware"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response

    const { id } = params
    const body = await request.json()
    const { notesTitle, classId, file } = body

    // Validate note exists
    const existingNote = await prisma.importantNotes.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    // Validate updated class if provided
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      })

      if (!classExists) {
        return NextResponse.json({ success: false, message: "Class not found" }, { status: 404 })
      }
    }

    const updatedNote = await prisma.importantNotes.update({
      where: { id },
      data: {
        ...(notesTitle && { notesTitle }),
        ...(classId && { classId }),
        ...(file && { file }),
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: updatedNote }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating note:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to update note",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response

    const { id } = params

    const existingNote = await prisma.importantNotes.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
    }

    await prisma.importantNotes.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Note deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to delete note",
      },
      { status: 500 },
    )
  }
}
