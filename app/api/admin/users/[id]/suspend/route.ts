import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  if (auth.session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = params.id;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { status: "SUSPENDED" },
      select: { id: true, status: true },
    });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ error: "Failed to suspend user" }, { status: 500 });
  }
}


