import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { currentPlanStatus } from "@/lib/auth/plansMiddleware";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response; // handles unauthorized automatically

    const { searchParams } = new URL(request.url);

    // 🔹 Parse userIds & subjectIds arrays like: ?userIds=[1,2,3]
    const parseArrayParam = (param: string | null): string[] => {
      if (!param) return [];
      try {
        // Try parsing JSON-like arrays: [1,2,3] or ["a","b"]
        const parsed = JSON.parse(param);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        // If not valid JSON, handle comma-separated fallback
        return param.split(",").map((v) => v.trim());
      }
      return [];
    };

    const userIds = parseArrayParam(searchParams.get("userIds"));
    const subjectIds = parseArrayParam(searchParams.get("subjectIds"));
    const search = searchParams.get("search") || "";

    // 🔹 Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // 🔹 Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // 🔹 Filters
    const filters: any = {};

    if (userIds.length > 0) {
      filters.userId = { in: userIds };
    }

    if (subjectIds.length > 0) {
      filters.subjectId = { in: subjectIds };
    }

    if (search) {
      filters.title = { contains: search, mode: "insensitive" };
    }

    // 🔹 Fetch total count
    const totalRecords = await prisma.generatedPaper.count({ where: filters });

    // 🔹 Fetch paginated papers
    const papers = await prisma.generatedPaper.findMany({
      where: filters,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      success: true,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: papers,
    });
  } catch (error: any) {
    console.error("Error fetching papers:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to fetch papers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;
    const planStatus = await currentPlanStatus();

    if (!planStatus?.ok) {
      return NextResponse.json(
        {
          success: false,
          message: planStatus?.message || "Subscription plan issue.",
          status: 402
        },
        { status: 402 }
      );
    }

    const { userId } = auth;
    if (!userId)
      return NextResponse.json(
        { success: false, message: "User ID not found", status: 422 },
        { status: 422 }
      );

    const body = await request.json();
    const { subjectSlug, mcqs, shortQs, longQs, title, totalMarks, examTime } =
      body;

    if (!subjectSlug) {
      return NextResponse.json(
        { success: false, message: "Subject Slug is required", status: 422 },
        { status: 422 }
      );
    }

    const subject = await prisma.subject
      .findUnique({
        where: { slug: subjectSlug },
        select: { id: true, boardId: true, classId: true },
      })

    if (!subject?.id) {
      return NextResponse.json(
        { success: false, message: "Subject Id is required", status: 422 },
        { status: 422 }
      );
    }

    if (!title || !totalMarks) {
      return NextResponse.json(
        { success: false, message: "Title and total marks are required", status: 422 },
        { status: 422 }
      );
    }

    if (!subject?.boardId || !subject?.classId) {
      return NextResponse.json(
        { success: false, message: "Subject not found", status: 404 },
        { status: 404 }
      );
    }

    const paper = await prisma.generatedPaper.create({
      data: {
        title,
        totalMarks,
        examTime: examTime,
        userId,
        subjectId: subject?.id,
        boardId: subject?.boardId,
        classId: subject?.classId,
        mcqs,
        shortQs,
        longQs,
      },
    });

    await prisma.subscription.update({
      where: { userId },
      data: {
        papersGenerated: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true, data: paper, status: 201 }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating paper:", error);

    // Prisma known request error
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "Paper already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message || "Failed to create paper",
      },
      { status: 500 }
    );
  }
}
