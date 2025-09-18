import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils/slugify";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || null;
    const chapterId = searchParams.get("chapterId");
    const chapterIds = searchParams.getAll("chapterIds"); // multiple chapterIds like ?chapterIds=1&chapterIds=2

    // Build dynamic filter
    const where: any = {};

    // text search (MongoDB Prisma only supports "contains" for string search)
    if (search) {
      where.question = {
        contains: search,
        mode: "insensitive", // case-insensitive search
      };
    }

    // Single chapter filter
    if (chapterId) {
      where.chapterId = chapterId;
    }

    // Multiple chapters filter
    if (chapterIds.length > 0) {
      where.chapterId = { in: chapterIds };
    }

    // Fetch paginated results
    const [questions, total] = await Promise.all([
      prisma.mCQQuestion.findMany({
        where,
        include: {
          chapter: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.mCQQuestion.count({ where }),
    ]);

    return NextResponse.json({
      data: questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle multiple questions (array) or single question (object)
    const questionsArray = Array.isArray(body) ? body : [body];

    // Validate
    for (const q of questionsArray) {
      if (
        !q.question ||
        !q.correctAnswer ||
        !q.options ||
        q.options?.length === 0
      ) {
        return NextResponse.json(
          { error: "Each question must include 'question', 'options', 'correctAnswer', and 'chapterId'." },
          { status: 422 }
        );
      }
    }

    // Prepare data for bulk insert
    const data = questionsArray?.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty || "medium",
      chapterId: q.chapterId,
      isActive: q.isActive ?? true,
    }));

    // Check for existing questions to avoid duplicates based on question string
    const existingQuestions = await prisma.mCQQuestion.findMany({
      where: {
        question: { in: data.map(d => d.question) },
      },
      select: { question: true },
    });

    const existingSet = new Set(existingQuestions.map(e => e.question));
    const filteredData = data.filter(d => !existingSet.has(d.question));

    // Insert only non-duplicates
    const created = await prisma.mCQQuestion.createMany({
      data: filteredData,
    });

    return NextResponse.json(
      { success: true, insertedCount: created.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating MCQs:", error);
    return NextResponse.json(
      { error: "Failed to create MCQs" },
      { status: 500 }
    );
  }
}
