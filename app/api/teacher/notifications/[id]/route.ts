import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { toTeacherNotificationDto } from "@/lib/notifications/notificationDto";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
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

    const notification = await prisma.notification.findFirst({
      where: { id: params.id, userId: auth.userId },
    });

    if (!notification) {
      return NextResponse.json({ success: false, error: "Not Found", message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: toTeacherNotificationDto(notification) });
  } catch (error: any) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message ?? "Failed to fetch notification" },
      { status: 500 },
    );
  }
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
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

    const notification = await prisma.notification.findFirst({
      where: { id: params.id, userId: auth.userId },
    });

    if (!notification) {
      return NextResponse.json({ success: false, error: "Not Found", message: "Notification not found" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id: notification.id },
      data: notification.readAt ? {} : { readAt: new Date() },
    });

    return NextResponse.json({ success: true, data: toTeacherNotificationDto(updated) });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message ?? "Failed to update notification" },
      { status: 500 },
    );
  }
}
