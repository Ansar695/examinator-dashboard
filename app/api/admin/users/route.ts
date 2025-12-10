import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  // Only admins
  if (!auth.session || auth.session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;
  const role = searchParams.get("role") || undefined;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { username: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (role) where.role = role;

  const [rawUsers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const users = rawUsers.map(({ password, ...user }) => user);

  return NextResponse.json({
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

function generateSixDigitPassword() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  if (!auth.session || auth.session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, username, name, role, age, phone, profilePicture, institutionName, institutionLogo } = body || {};


  const isExist = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (isExist) {
    return NextResponse.json(
      { error: "Email or username already exists" },
      { status: 409 }
    );
  }

  if (!email || !username || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 422 });
  }
  const password = generateSixDigitPassword();
  // Password hashing should be centralized; using bcryptjs here
  const bcrypt = await import("bcryptjs");
  const hashed = await bcrypt.hash(password, 10);

  try {
    const createdUser = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashed,
        role,
        age: age ? Number(age) : null,
        phone: phone || null,
        profilePicture: profilePicture || null,
        institutionName: institutionName || null,
        institutionLogo: institutionLogo || null,
      },
    });

    const { password: _pw, ...user } = createdUser;

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
