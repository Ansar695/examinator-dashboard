import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate userId
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    const currentPlan = await prisma.subscription.findFirst({
      where: {
        userId: id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalGeneratedPapers = await prisma.generatedPaper.count({
      where: {
        userId: id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user, currentPlan, totalGeneratedPapers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
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
