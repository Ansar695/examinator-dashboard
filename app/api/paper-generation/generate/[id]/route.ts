import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireAuth } from "@/lib/auth/authMiddleware";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing paper ID" },
        { status: 400 }
      );
    }

    // ✅ Fetch paper by ID
    const paper = await prisma.generatedPaper.findUnique({
      where: { id },
      include: {
        // Optional: include related data if needed
        subject: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!paper) {
      return NextResponse.json(
        { success: false, error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: paper,
    });
  } catch (error: any) {
    console.error("Error fetching paper by ID:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch paper",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { userId } = auth;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing paper ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, totalMarks, examTime, mcqs, shortQs, longQs } = body;

    // Check if paper exists and belongs to user
    const existingPaper = await prisma.generatedPaper.findFirst({
      where: {
        id,
        userId
      },
    });

    if (!existingPaper) {
      return NextResponse.json(
        { success: false, error: "Paper not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the paper
    const updatedPaper = await prisma.generatedPaper.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(totalMarks !== undefined && { totalMarks }),
        ...(examTime !== undefined && { examTime }),
        ...(mcqs && { mcqs }),
        ...(shortQs && { shortQs }),
        ...(longQs && { longQs }),
        updatedAt: new Date(),
      },
      include: {
        subject: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPaper,
    });
  } catch (error: any) {
    console.error("Error updating paper:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to update paper",
      },
      { status: 500 }
    );
  }
}
