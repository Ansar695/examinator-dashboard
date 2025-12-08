// import { type NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // Pagination
//     const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
//     const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
//     const skip = (page - 1) * limit;

//     const questionType = searchParams.get("questionType");
//     const chapterIds = searchParams.getAll("chapterIds");
//     const parsedIds = JSON.parse(chapterIds as any);

//     // Base filter
//     const where: any = { isActive: true };

//     if (parsedIds.length > 0) {
//       where.chapterId = { in: parsedIds };
//     }
//     if (questionType) where.questionType = questionType.toUpperCase();

//     const questions = await prisma.longQuestion.findMany({
//       where: where,
//       //   orderBy: [{ usageCount: "asc" }, { createdAt: "desc" }],
//       include: {
//         chapter: {
//           select: {
//             id: true,
//             name: true,
//             chapterNumber: true,
//             subject: {
//               select: {
//                 id: true,
//                 name: true,
//                 class: { select: { id: true, name: true } },
//               },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       data: questions,
//       pagination: {
//         page,
//         limit,
//       },
//       metadata: {
//         algorithm: "usage-based-random",
//         usageTracked: true,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching long questions:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20", 10));
    const skip = (page - 1) * limit;

    // Chapter IDs
    const chapterIdsRaw = searchParams.get("chapterIds");
    const chapterIds: string[] = chapterIdsRaw ? JSON.parse(chapterIdsRaw) : [];

    if (!chapterIds.length) {
      return NextResponse.json(
        { error: "chapterIds are required" },
        { status: 400 }
      );
    }

    // Optional question type filter
    const questionType = searchParams.get("questionType")?.toUpperCase();

    // Balanced distribution
    const perChapterLimit = Math.floor(limit / chapterIds.length);
    const remainder = limit % chapterIds.length;

    let finalQuestions: any[] = [];

    for (let i = 0; i < chapterIds.length; i++) {
      const chapterId = chapterIds[i];
      const chapterLimit = i < remainder ? perChapterLimit + 1 : perChapterLimit;
      const chapterSkip = skip <= 0 ? 0 : Math.floor(skip / chapterIds.length);

      const questions = await prisma.longQuestion.findMany({
        where: {
          isActive: true,
          chapterId: chapterId,
        },
        orderBy: [
          { usageCount: "asc" }, // least used first
          { createdAt: "desc" }  // tie-breaker
        ],
        skip: chapterSkip,
        take: chapterLimit,
        include: {
          chapter: {
            select: {
              id: true,
              name: true,
              chapterNumber: true,
              subject: {
                select: {
                  id: true,
                  name: true,
                  class: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });

      // Shuffle inside chapter
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      finalQuestions.push(...questions);
    }

    // Final shuffle across chapters
    for (let i = finalQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
    }

    // Total count
    const total = await prisma.longQuestion.count({
      where: {
        isActive: true,
        chapterId: { in: chapterIds },
      },
    });

    // Increment usage count in background
    if (finalQuestions.length > 0) {
      prisma.longQuestion.updateMany({
        where: {
          id: { in: finalQuestions.map(q => q.id) }
        },
        data: {
          usageCount: { increment: 1 }
        }
      }).catch(console.error);
    }

    return NextResponse.json({
      data: finalQuestions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      metadata: {
        algorithm: "balanced-chapter-usage-random",
        usageTracked: true
      }
    });

  } catch (error) {
    console.error("Error fetching long questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch long questions" },
      { status: 500 }
    );
  }
}
