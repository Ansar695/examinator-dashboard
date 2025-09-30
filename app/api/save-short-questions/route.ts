import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      prisma.shortQuestion.findMany({
        where,
        include: {
          chapter: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.shortQuestion.count({ where }),
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

    // Validate input
    for (const q of questionsArray) {
      if ( !q.question || !q.chapterId ) {
        return NextResponse.json(
          {
            error: "Each question must include 'question' and 'chapterId'."
          },
          { status: 422 }
        );
      }
    }

    // Extract questions to check for duplicates
    const questionsToCheck = questionsArray.map((q: any) => q.question);

    // Check for existing questions in database
    const existingQuestions = await prisma.shortQuestion.findMany({
      where: {
        question: {
          in: questionsToCheck
        }
      },
      select: {
        question: true
      }
    });

    const existingQuestionTexts = new Set(
      existingQuestions.map(eq => eq.question)
    );

    // Filter out duplicates
    const newQuestions = questionsArray.filter(
      (q: any) => !existingQuestionTexts.has(q.question)
    );

    if (newQuestions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "All questions already exist in the database",
          duplicateCount: questionsArray.length,
          insertedCount: 0
        },
        { status: 409 }
      );
    }

    // Prepare data for bulk insert
    const data = newQuestions.map((q: any) => ({
      question: q.question,
      answer: q.answer,
      difficulty: (q.difficulty || "medium").toUpperCase(),
      chapterId: q.chapterId,
      isActive: q.isActive ?? true,
      usageCount: 0,
    }));

    // Insert only non-duplicates
    const created = await prisma.shortQuestion.createMany({
      data: data,
    });

    return NextResponse.json(
      {
        success: true,
        insertedCount: created.count,
        duplicateCount: questionsArray.length - newQuestions.length,
        duplicates: questionsArray
          .filter((q: any) => existingQuestionTexts.has(q.question))
          .map((q: any) => q.question)
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating Short Questions:", error);
    
    // Handle unique constraint violation if using database-level constraint
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: "One or more questions already exist" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create Short Questions" },
      { status: 500 }
    );
  }
}