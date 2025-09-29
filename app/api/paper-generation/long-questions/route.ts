// import { type NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // Pagination params
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // Filters
//     const chapterId = searchParams.get("chapterId");
//     const chapterIds = searchParams.getAll("chapterIds");
//     const questionType = searchParams.get("questionType");

//     // Build dynamic filter
//     const where: any = {
//       isActive: true // Only get active questions
//     };

//     // Single chapter filter
//     if (chapterId) {
//       where.chapterId = chapterId;
//     }

//     // Multiple chapters filter
//     if (chapterIds.length > 0) {
//       where.chapterId = { in: chapterIds };
//     }

//     // Question type filter
//     if (questionType) {
//       where.questionType = questionType.toUpperCase();
//     }

//     // Optimized query using aggregation pipeline for better performance
//     // First, get questions grouped by usage count with limited fields
//     const questionsWithUsage = await prisma.longQuestion.findMany({
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
//     const questions = await prisma.longQuestion.findMany({
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
//       prisma.longQuestion.updateMany({
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
//     console.error("Error fetching long questions for paper generation:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch long questions for paper generation" },
//       { status: 500 }
//     );
//   }
// }

// app/api/questions/long/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
console.log("Fetch long questions with params:", searchParams.toString());
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    // Filters
    const chapterId = searchParams.get("chapterId");
    const chapterIds = searchParams.getAll("chapterIds");
    const questionType = searchParams.get("questionType");

    // Base filter
    const where: any = { isActive: true };

    if (chapterId) where.chapterId = chapterId;
    if (chapterIds && chapterIds.length > 0) where.chapterId = { in: chapterIds };
    if (questionType) where.questionType = questionType.toUpperCase();

    // Step 1: fetch candidate IDs ordered by usageCount asc
    // const candidates = await prisma.longQuestion.findMany({
    //   where,
    //   select: { id: true, usageCount: true, createdAt: true },
    //   orderBy: [{ usageCount: "asc" }, { createdAt: "desc" }],
    // });

    // if (candidates.length === 0) {
    //   return NextResponse.json({
    //     data: [],
    //     pagination: { page, limit, total: 0, totalPages: 0 },
    //     metadata: { algorithm: "usage-based-random", usageTracked: true },
    //   });
    // }

    // // Step 2: group by usageCount
    // const grouped: Record<number, string[]> = {};
    // for (const c of candidates) {
    //   const count = c.usageCount ?? 0;
    //   if (!grouped[count]) grouped[count] = [];
    //   grouped[count].push(c.id);
    // }

    // // Step 3: shuffle within each usage group
    // const shuffle = (arr: string[]) => {
    //   for (let i = arr.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [arr[i], arr[j]] = [arr[j], arr[i]];
    //   }
    //   return arr;
    // };

    // const sortedUsageKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    // const shuffledIds: string[] = [];
    // for (const key of sortedUsageKeys) {
    //   shuffle(grouped[key]);
    //   shuffledIds.push(...grouped[key]);
    // }

    // // Step 4: pagination
    // const total = shuffledIds.length;
    // const paginatedIds = shuffledIds.slice(skip, skip + limit);

    // Step 5: fetch full data
    const questions = await prisma.longQuestion.findMany({
      where: where,
    //   orderBy: [{ usageCount: "asc" }, { createdAt: "desc" }],
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

    console.log(`Fetched `, questions);

    // Preserve shuffled order
    // const questionMap = new Map(questions.map((q) => [q.id, q]));
    // const orderedResults = paginatedIds.map((id) => questionMap.get(id)).filter(Boolean);

    // Step 6: increment usageCount asynchronously
    // if (paginatedIds.length > 0) {
    //   prisma.longQuestion
    //     .updateMany({
    //       where: { id: { in: paginatedIds } },
    //       data: { usageCount: { increment: 1 } as any },
    //     })
    //     .catch((err) => console.error("Error updating usageCount:", err));
    // }

    return NextResponse.json({
      data: questions,
      pagination: {
        page,
        limit,
        // total,
        // totalPages: Math.ceil(total / limit),
      },
      metadata: {
        algorithm: "usage-based-random",
        usageTracked: true,
      },
    });
  } catch (error) {
    console.error("Error fetching long questions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
