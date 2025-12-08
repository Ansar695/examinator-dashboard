// import { type NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // Pagination params
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     const chapterIds = searchParams.getAll("chapterIds");
//     const parsedIds = JSON.parse(chapterIds as any);

//     // Build dynamic filter
//     const where: any = {
//       isActive: true // Only get active questions
//     };

//     // Multiple chapters filter
//     if (parsedIds.length > 0) {
//       where.chapterId = { in: parsedIds };
//     }

//     // Optimized query using aggregation pipeline for better performance
//     // First, get questions grouped by usage count with limited fields
//     const questionsWithUsage = await prisma.shortQuestion.findMany({
//       where,
//       select: {
//         id: true,
//         usageCount: true,
//       } as any,
//       orderBy: [
//         { usageCount: "asc" } as any,
//         { createdAt: "desc" }
//       ],
//     });

//     // Group by usage count for efficient shuffling
//     const groupedByUsage = questionsWithUsage.reduce((acc, q) => {
//       const count = (q as any).usageCount || 0;
//       if (!acc[count]) {
//         acc[count] = [];
//       }
//       acc[count].push(q.id);
//       return acc;
//     }, {} as Record<number, string[]>);

//     // Shuffle within each usage group and flatten
//     const shuffledIds: string[] = [];
//     Object.keys(groupedByUsage)
//       .sort((a, b) => Number(a) - Number(b))
//       .forEach(usageCount => {
//         const ids = groupedByUsage[Number(usageCount)];
//         // Fisher-Yates shuffle
//         for (let i = ids.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [ids[i], ids[j]] = [ids[j], ids[i]];
//         }
//         shuffledIds.push(...ids);
//       });

//     // Get paginated IDs
//     const paginatedIds = shuffledIds.slice(skip, skip + limit);
//     const total = shuffledIds.length;

//     // Fetch full question data only for the paginated results
//     const questions = await prisma.shortQuestion.findMany({
//       where: {
//         id: { in: paginatedIds }
//       },
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
//                 class: {
//                   select: {
//                     id: true,
//                     name: true,
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     // Sort questions according to shuffled order
//     const questionMap = new Map(questions.map(q => [q.id, q]));
//     const sortedQuestions = paginatedIds
//       .map(id => questionMap.get(id))
//       .filter(Boolean);

//     // Increment usage count for fetched questions (async, don't wait)
//     if (paginatedIds.length > 0) {
//       prisma.shortQuestion.updateMany({
//         where: {
//           id: { in: paginatedIds }
//         },
//         data: {
//           usageCount: { increment: 1 }
//         } as any
//       }).catch(error => {
//         console.error("Error updating usage count:", error);
//       });
//     }

//     return NextResponse.json({
//       data: sortedQuestions,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//       metadata: {
//         algorithm: "usage-based-random",
//         usageTracked: true
//       }
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch short questions for paper generation" },
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
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

    // Balanced distribution
    const perChapterLimit = Math.floor(limit / chapterIds.length);
    const remainder = limit % chapterIds.length;

    let finalQuestions: any[] = [];

    // Fetch per chapter
    for (let i = 0; i < chapterIds.length; i++) {
      const chapterId = chapterIds[i];

      const chapterLimit =
        i < remainder ? perChapterLimit + 1 : perChapterLimit;

      const chapterSkip = skip <= 0 ? 0 : Math.floor(skip / chapterIds.length);

      const questions = await prisma.shortQuestion.findMany({
        where: {
          isActive: true,
          chapterId: chapterId // Prisma auto converts to ObjectId if needed
        },
        orderBy: [
          { usageCount: "asc" }, // least used first
          { createdAt: "desc" }  // tie-breaker
        ],
        skip: chapterSkip,
        take: chapterLimit
      });

      // Shuffle inside chapter
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }

      finalQuestions.push(...questions);
    }

    // Shuffle across chapters
    for (let i = finalQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
    }

    // Total count
    const total = await prisma.shortQuestion.count({
      where: {
        isActive: true,
        chapterId: { in: chapterIds }
      }
    });

    // Increment usage count in background
    if (finalQuestions.length > 0) {
      prisma.shortQuestion.updateMany({
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
    console.error("Balanced Short Question Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch short questions for paper generation" },
      { status: 500 }
    );
  }
}
