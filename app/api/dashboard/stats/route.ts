import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";
import { differenceInCalendarDays, format, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    if (!auth.session || auth.session.user.role !== "TEACHER") {
      return NextResponse.json(
        {
          success: false,
          error: "Authorization error",
          message: "You are not authorized to access this resource",
        },
        { status: 403 }
      );
    }

    const now = new Date();
    const start30Days = startOfDay(subDays(now, 29));
    const start7Days = startOfDay(subDays(now, 6));
    const startToday = startOfDay(now);
    const startThisWeek = startOfWeek(now, { weekStartsOn: 1 }); // Pakistan commonly uses Monday-start
    const startThisMonth = startOfMonth(now);

    const currentPlan = await prisma.subscription.findUnique({
      where: { userId: auth.userId },
    });

    const totalPapersAllTime = await prisma.generatedPaper.count({
      where: { userId: auth.userId },
    });

    const papersToday = await prisma.generatedPaper.count({
      where: { userId: auth.userId, createdAt: { gte: startToday } },
    });

    const papersThisWeek = await prisma.generatedPaper.count({
      where: { userId: auth.userId, createdAt: { gte: startThisWeek } },
    });

    const papersThisMonth = await prisma.generatedPaper.count({
      where: { userId: auth.userId, createdAt: { gte: startThisMonth } },
    });

    // Fetch last 5 generated papers (sorted by newest first)
    const lastFivePapers = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        totalMarks: true,
        examTime: true,
        mcqs: { select: { marks: true } },
        shortQs: { select: { marks: true } },
        longQs: { select: { totalMarks: true } },
        subject: {
          select: {
            id: true,
            name: true,
            slug: true,
            class: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        board: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Pull a limited "analysis set" to compute charts/insights without shipping large payloads.
    // We only select the nested fields we need (counts/marks), not full question text/options.
    const analysisPapers = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId, createdAt: { gte: start30Days } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        createdAt: true,
        subjectId: true,
        classId: true,
        boardId: true,
        totalMarks: true,
        examTime: true,
        mcqs: { select: { marks: true } },
        shortQs: { select: { marks: true } },
        longQs: { select: { totalMarks: true } },
      },
      take: 250,
    });

    const papersByDayMap = new Map<string, number>();
    const subjectCountMap = new Map<string, number>();
    const classCountMap = new Map<string, number>();
    const boardCountMap = new Map<string, number>();

    let totalMcqs = 0;
    let totalShorts = 0;
    let totalLongs = 0;
    let totalQuestions = 0;
    let totalMarks = 0;

    for (const paper of analysisPapers) {
      const dayKey = format(paper.createdAt, "yyyy-MM-dd");
      papersByDayMap.set(dayKey, (papersByDayMap.get(dayKey) ?? 0) + 1);

      subjectCountMap.set(paper.subjectId, (subjectCountMap.get(paper.subjectId) ?? 0) + 1);
      classCountMap.set(paper.classId, (classCountMap.get(paper.classId) ?? 0) + 1);
      boardCountMap.set(paper.boardId, (boardCountMap.get(paper.boardId) ?? 0) + 1);

      const mcqCount = paper.mcqs?.length ?? 0;
      const shortCount = paper.shortQs?.length ?? 0;
      const longCount = paper.longQs?.length ?? 0;

      totalMcqs += mcqCount;
      totalShorts += shortCount;
      totalLongs += longCount;
      totalQuestions += mcqCount + shortCount + longCount;
      totalMarks += paper.totalMarks ?? 0;
    }

    const last30DaysSeries: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < 30; i += 1) {
      const day = startOfDay(subDays(now, 29 - i));
      const key = format(day, "yyyy-MM-dd");
      last30DaysSeries.push({
        date: format(day, "MMM d"),
        count: papersByDayMap.get(key) ?? 0,
      });
    }

    const topN = <T extends { id: string; count: number }>(items: T[], n = 5) =>
      items.sort((a, b) => b.count - a.count).slice(0, n);

    const subjectTop = topN(
      Array.from(subjectCountMap.entries()).map(([id, count]) => ({ id, count })),
      5
    );
    const classTop = topN(
      Array.from(classCountMap.entries()).map(([id, count]) => ({ id, count })),
      5
    );
    const boardTop = topN(
      Array.from(boardCountMap.entries()).map(([id, count]) => ({ id, count })),
      5
    );

    const [subjects, classes, boards] = await Promise.all([
      prisma.subject.findMany({ where: { id: { in: subjectTop.map((s) => s.id) } }, select: { id: true, name: true, slug: true } }),
      prisma.class.findMany({ where: { id: { in: classTop.map((c) => c.id) } }, select: { id: true, name: true, slug: true, type: true } }),
      prisma.board.findMany({ where: { id: { in: boardTop.map((b) => b.id) } }, select: { id: true, name: true, slug: true } }),
    ]);

    const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));
    const subjectById = byId(subjects);
    const classById = byId(classes);
    const boardById = byId(boards);

    const charts = {
      papersLast30Days: last30DaysSeries,
      topSubjectsLast30Days: subjectTop.map((s) => ({
        id: s.id,
        name: subjectById.get(s.id)?.name ?? "Unknown",
        slug: subjectById.get(s.id)?.slug ?? "",
        count: s.count,
      })),
      topClassesLast30Days: classTop.map((c) => ({
        id: c.id,
        name: classById.get(c.id)?.name ?? "Unknown",
        slug: classById.get(c.id)?.slug ?? "",
        type: classById.get(c.id)?.type ?? null,
        count: c.count,
      })),
      topBoardsLast30Days: boardTop.map((b) => ({
        id: b.id,
        name: boardById.get(b.id)?.name ?? "Unknown",
        slug: boardById.get(b.id)?.slug ?? "",
        count: b.count,
      })),
      questionMixLast30Days: [
        { name: "MCQs", value: totalMcqs },
        { name: "Short", value: totalShorts },
        { name: "Long", value: totalLongs },
      ],
    };

    const quotaLimit = currentPlan?.monthlyLimit ?? 0;
    const quotaUsed = currentPlan?.papersGenerated ?? 0;
    const quotaRemaining = Math.max(quotaLimit - quotaUsed, 0);
    const usedPercentage = quotaLimit > 0 ? Math.min(Math.round((quotaUsed / quotaLimit) * 100), 100) : 0;
    const daysToRenewal =
      currentPlan?.renewalDate ? Math.max(differenceInCalendarDays(currentPlan.renewalDate, now), 0) : null;

    const stats = {
      totalPaper: quotaLimit,
      usedPaper: quotaUsed,
      remainingPaper: quotaRemaining,
      currentPlan: currentPlan?.planType || "FREE",
      expiryDate: currentPlan?.renewalDate || null,
      usedPercentage,
      daysToRenewal,
    };

    const [
      totalBoards,
      totalClasses,
      totalSubjects,
      totalChapters,
      totalMCQs,
      totalShortQs,
      totalLongQs,
    ] = await Promise.all([
      prisma.board.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.chapter.count(),
      prisma.mCQQuestion.count(),
      prisma.shortQuestion.count(),
      prisma.longQuestion.count(),
    ]);

    const bank = {
      totalBoards,
      totalClasses,
      totalSubjects,
      totalChapters,
      totalMCQs,
      totalShortQs,
      totalLongQs,
    };

    const avgQuestionsPerPaper = analysisPapers.length > 0 ? totalQuestions / analysisPapers.length : 0;
    const avgMarksPerPaper = analysisPapers.length > 0 ? totalMarks / analysisPapers.length : 0;

    const alerts: Array<{ id: string; type: "info" | "warning" | "danger"; title: string; message: string }> = [];
    if (!currentPlan) {
      alerts.push({
        id: "no-plan",
        type: "warning",
        title: "No active plan found",
        message: "Subscribe to a plan to start generating papers.",
      });
    } else if (quotaLimit > 0) {
      if (quotaRemaining === 0) {
        alerts.push({
          id: "quota-zero",
          type: "danger",
          title: "Monthly quota reached",
          message: "Upgrade your plan or wait for renewal to generate more papers.",
        });
      } else if (quotaRemaining <= Math.max(3, Math.round(quotaLimit * 0.1))) {
        alerts.push({
          id: "quota-low",
          type: "warning",
          title: "Quota running low",
          message: `Only ${quotaRemaining} papers remaining before renewal.`,
        });
      }

      if (daysToRenewal !== null && daysToRenewal <= 3) {
        alerts.push({
          id: "renewal-soon",
          type: "info",
          title: "Renewal coming soon",
          message: `Your plan renews in ${daysToRenewal} day(s).`,
        });
      }
    }

    // Return both results
    return NextResponse.json({
      status: 200,
      data: {
        stats,
        overview: {
          totalPapersAllTime,
          papersToday,
          papersThisWeek,
          papersThisMonth,
          papersLast7Days: analysisPapers.filter((p) => p.createdAt >= start7Days).length,
          avgQuestionsPerPaper: Number(avgQuestionsPerPaper.toFixed(1)),
          avgMarksPerPaper: Number(avgMarksPerPaper.toFixed(1)),
          questionsGeneratedLast30Days: totalQuestions,
        },
        charts,
        bank,
        alerts,
        papers: lastFivePapers,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
