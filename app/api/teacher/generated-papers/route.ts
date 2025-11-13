import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response; // handles unauthorized automatically

    const { searchParams } = new URL(request.url);

    if (!auth?.session || auth?.session?.user?.role !== "TEACHER") {
      return NextResponse.json(
        {
          success: false,
          error: "Authorization error",
          message: "You are not authorized to access this page",
        },
        { status: 404 }
      );
    }
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
    const filters: any = {userId: auth?.userId};

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
      include: {
        class: true,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      success: true,
      meta: {
        total:totalRecords,
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
