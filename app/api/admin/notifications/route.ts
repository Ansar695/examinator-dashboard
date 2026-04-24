import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { broadcastToTeachers } from "@/lib/notifications/notificationService";
import type { NotificationType } from "@prisma/client";

type Body = {
  type?: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  href?: string;
  institutionName?: string | null;
};

function toPrismaType(type: Body["type"]): NotificationType {
  switch (type) {
    case "success":
      return "SUCCESS";
    case "warning":
      return "WARNING";
    case "error":
      return "ERROR";
    case "info":
    default:
      return "INFO";
  }
}

export async function POST(request: Request) {
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden", message: "Not authorized" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as Body;
    if (!body?.title?.trim() || !body?.message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation", message: "Title and message are required" },
        { status: 422 },
      );
    }

    const result = await broadcastToTeachers({
      institutionName: body.institutionName ?? null,
      type: toPrismaType(body.type),
      title: body.title.trim(),
      message: body.message.trim(),
      href: body.href,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error broadcasting notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", message: error.message ?? "Failed to broadcast notification" },
      { status: 500 },
    );
  }
}

