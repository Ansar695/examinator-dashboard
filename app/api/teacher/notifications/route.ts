import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { toTeacherNotificationDto } from "@/lib/notifications/notificationDto";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 10)));
    const onlyUnread = (searchParams.get("onlyUnread") ?? "").toLowerCase() === "true";

    const where = {
      userId: auth.userId,
      ...(onlyUnread ? { readAt: null } : {}),
    } as const;

    const [total, unreadCount, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: auth.userId, readAt: null } }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        unreadCount,
      },
      data: notifications.map(toTeacherNotificationDto),
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message ?? "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
