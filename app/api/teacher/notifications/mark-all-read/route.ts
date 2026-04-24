import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function POST() {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const session = auth.session;
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Please login first" },
        { status: 401 },
      );
    }

    if (session.user.role !== "TEACHER") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Not authorized" },
        { status: 403 },
      );
    }

    const now = new Date();

    const result = await prisma.notification.updateMany({
      where: { userId: auth.userId, readAt: null },
      data: { readAt: now },
    });

    return NextResponse.json({ success: true, data: { updated: result.count } });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message ?? "Failed to mark all as read" },
      { status: 500 },
    );
  }
}
