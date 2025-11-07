// app/api/profile/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "../[...nextauth]/route";

const prisma = new PrismaClient();

// Profile update schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Invalid phone number"
    )
    .optional(),
  age: z.number().min(18, "Age must be at least 18").max(100, "Age must be less than 100").optional(),
  institutionName: z.string().min(2, "Institution name must be at least 2 characters").optional(),
  profilePicture: z.string().url("Invalid profile picture URL").optional().or(z.literal("")),
  institutionLogo: z.string().url("Invalid institution logo URL").optional().or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        age: true,
        role: true,
        institutionName: true,
        institutionLogo: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        // 👇 Include related subscription data
        Subscription: {
          select: {
            id: true,
            planType: true,
            monthlyLimit: true,
            papersGenerated: true,
            pricePerMonth: true,
            renewalDate: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}


// PATCH /api/profile - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if username or email already exists (if being updated)
    if (data.username || data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: session.user.id } },
            {
              OR: [
                data.username ? { username: data.username } : {},
                data.email ? { email: data.email } : {},
              ],
            },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.username === data.username) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 409 }
          );
        }
        if (existingUser.email === data.email) {
          return NextResponse.json(
            { error: "Email already in use" },
            { status: 409 }
          );
        }
      }
    }

    // Handle password update
    let hashedPassword: string | undefined;
    if (data.currentPassword && data.newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const isCorrectPassword = await bcrypt.compare(
        data.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      hashedPassword = await bcrypt.hash(data.newPassword, 12);
    }

    // Prepare update data
    const updateData: any = {
      ...(data.name && { name: data.name }),
      ...(data.username && { username: data.username }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.age && { age: data.age }),
      ...(data.institutionName && { institutionName: data.institutionName }),
      ...(data.profilePicture !== undefined && { profilePicture: data.profilePicture }),
      ...(data.institutionLogo !== undefined && { institutionLogo: data.institutionLogo }),
      ...(hashedPassword && { password: hashedPassword }),
      updatedAt: new Date(),
    };

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        age: true,
        role: true,
        institutionName: true,
        institutionLogo: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/profile - Delete user account (optional)
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}