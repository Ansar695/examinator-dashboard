import { requireAuth } from "@/lib/auth/authMiddleware"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response

    const { id } = params
    const body = await request.json()
    const { boardName, boardYear, paperFile, fileSize } = body

    // Validate note exists
    const existingNote = await prisma.boardPapers.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json({ success: false, message: "Board paper not found" }, { status: 404 })
    }

    const updatedPaper = await prisma.boardPapers.update({
      where: { id },
      data: {
        ...(boardName && { boardName }),
        ...(boardYear && { boardYear }),
        ...(paperFile && { paperFile }),
        ...(fileSize && { fileSize }),
      },
    })

    return NextResponse.json({ success: true, data: updatedPaper }, { status: 200 })
  } catch (error: any) {
    console.error("Error updating board paper:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to update board paper",
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

    const existingNote = await prisma.boardPapers.findUnique({
      where: { id },
    })

    if (!existingNote) {
      return NextResponse.json({ success: false, message: "Board paper not found" }, { status: 404 })
    }

    await prisma.boardPapers.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Board paper deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting board paper:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to delete board paper",
      },
      { status: 500 },
    )
  }
}
