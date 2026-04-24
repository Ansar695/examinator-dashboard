import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { createUserNotification } from "@/lib/notifications/notificationService";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return NextResponse.json(
      { error: "Paper Id not found", status: 422 },
      { status: 422 }
    );
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const session = auth.session;
    if (!session || !auth.userId) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 },
      );
    }

    const isExisting = await prisma.generatedPaper.findUnique({
      where: { id: params.id },
    });
    if (!isExisting) {
      return NextResponse.json(
        { error: "Paper not found", status: 404 },
        { status: 404 }
      );
    }

    if (session.user.role !== "ADMIN" && isExisting.userId !== auth.userId) {
      return NextResponse.json(
        { error: "Not authorized", status: 403 },
        { status: 403 },
      );
    }

    await prisma.generatedPaper.delete({
      where: { id: params.id },
    });

    try {
      await createUserNotification({
        userId: auth.userId,
        type: "INFO",
        title: "Paper deleted",
        message: `"${isExisting.title}" has been deleted.`,
        href: "/teacher/generated-papers",
        metadata: { paperId: isExisting.id },
      });
    } catch (notificationError) {
      console.error("Failed to create notification (paper deleted):", notificationError);
    }

    return NextResponse.json({
      message: "Paper deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Paper" },
      { status: 500 }
    );
  }
}
