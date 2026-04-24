import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Validate userId
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const subscriptionHistories = await prisma.subscriptionHistory.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalSubscriptionHistories = await prisma.subscriptionHistory.count({
      where: {
        userId: id,
      },
    });

    if (!subscriptionHistories) {
      return NextResponse.json({ error: "No subscription history found for this user" }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: subscriptionHistories,
        meta: { total: totalSubscriptionHistories, page, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription histories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  if (!auth.session || auth.session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = params.id;
  const body = await request.json();
  const {
    email,
    username,
    name,
    role,
    age,
    phone,
    profilePicture,
    institutionName,
    institutionLogo,
  } = body || {};

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(username ? { username } : {}),
        ...(role ? { role } : {}),
        ...(age ? { age } : {}),
        ...(phone ? { phone } : {}),
        ...(profilePicture ? { profilePicture } : {}),
        ...(institutionName ? { institutionName } : {}),
        ...(institutionLogo ? { institutionLogo } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
