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

    // Fetch Recent Activities
    const recentPapersForActivity = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        subject: { select: { name: true } }
      }
    });

    const recentActivities = recentPapersForActivity.map(paper => ({
      id: `paper-${paper.id}`,
      type: "PAPER_GENERATED",
      title: "Paper Generated",
      description: `${paper.title} (${paper.subject.name})`,
      time: paper.createdAt,
    }));

    // Add subscription activity if exists
    if (currentPlan) {
      recentActivities.push({
        id: `sub-${currentPlan.id}`,
        type: "PLAN_SUBSCRIBED",
        title: "Plan Active",
        description: `Currently on ${currentPlan.planType} Plan`,
        time: currentPlan.updatedAt,
      });
    }

    recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

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

    // Pull trend data (last 12 months for broad compatibility)
    const start12Months = startOfMonth(subDays(now, 365));
    const trendPapers = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId, createdAt: { gte: start12Months } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" }
    });

    // Generate series for different views
    const dailySeries: Array<{ date: string; count: number }> = [];
    const dailyMap = new Map<string, number>();
    
    trendPapers.filter(p => p.createdAt >= start30Days).forEach(p => {
      const key = format(p.createdAt, "yyyy-MM-dd");
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
    });

    for (let i = 0; i < 30; i++) {
      const day = startOfDay(subDays(now, 29 - i));
      const key = format(day, "yyyy-MM-dd");
      dailySeries.push({
        date: format(day, "MMM d"),
        count: dailyMap.get(key) ?? 0,
      });
    }

    const monthlySeries: Array<{ date: string; count: number }> = [];
    const monthlyMap = new Map<string, number>();
    trendPapers.forEach(p => {
      const key = format(p.createdAt, "yyyy-MM");
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
    });

    for (let i = 0; i < 12; i++) {
      const month = startOfMonth(subDays(now, (11 - i) * 30));
      const key = format(month, "yyyy-MM");
      monthlySeries.push({
        date: format(month, "MMM yyyy"),
        count: monthlyMap.get(key) ?? 0,
      });
    }

    // Existing Subject/Class/Board analysis on last 30 days
    const analysisPapers = await prisma.generatedPaper.findMany({
      where: { userId: auth.userId, createdAt: { gte: start30Days } },
      select: {
        id: true,
        subjectId: true,
        classId: true,
        boardId: true,
        totalMarks: true,
        mcqs: { select: { marks: true } },
        shortQs: { select: { marks: true } },
        longQs: { select: { totalMarks: true } },
      },
    });

    const subjectCountMap = new Map<string, number>();
    const classCountMap = new Map<string, number>();
    const boardCountMap = new Map<string, number>();

    let totalMcqs = 0;
    let totalShorts = 0;
    let totalLongs = 0;
    let totalQuestions = 0;
    let totalMarks = 0;

    for (const paper of analysisPapers) {
      subjectCountMap.set(paper.subjectId, (subjectCountMap.get(paper.subjectId) ?? 0) + 1);
      classCountMap.set(paper.classId, (classCountMap.get(paper.classId) ?? 0) + 1);
      boardCountMap.set(paper.boardId, (boardCountMap.get(paper.boardId) ?? 0) + 1);

      totalMcqs += paper.mcqs?.length ?? 0;
      totalShorts += paper.shortQs?.length ?? 0;
      totalLongs += paper.longQs?.length ?? 0;
      totalQuestions += (paper.mcqs?.length ?? 0) + (paper.shortQs?.length ?? 0) + (paper.longQs?.length ?? 0);
      totalMarks += paper.totalMarks ?? 0;
    }

    const topN = <T extends { id: string; count: number }>(items: T[], n = 5) =>
      items.sort((a, b) => b.count - a.count).slice(0, n);

    const subjectTop = topN(Array.from(subjectCountMap.entries()).map(([id, count]) => ({ id, count })));
    const classTop = topN(Array.from(classCountMap.entries()).map(([id, count]) => ({ id, count })));
    const boardTop = topN(Array.from(boardCountMap.entries()).map(([id, count]) => ({ id, count })));

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
      dailyTrend: dailySeries,
      monthlyTrend: monthlySeries,
      topSubjectsLast30Days: subjectTop.map((s) => ({
        id: s.id,
        name: subjectById.get(s.id)?.name ?? "Unknown",
        count: s.count,
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
      subscriptionDate: currentPlan?.createdAt || null,
      usedPercentage,
      daysToRenewal,
    };

    const [totalBoards, totalClasses, totalSubjects, totalChapters, totalMCQs, totalShortQs, totalLongQs] = await Promise.all([
      prisma.board.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.chapter.count(),
      prisma.mCQQuestion.count(),
      prisma.shortQuestion.count(),
      prisma.longQuestion.count(),
    ]);

    const bank = { totalBoards, totalClasses, totalSubjects, totalChapters, totalMCQs, totalShortQs, totalLongQs };

    const avgQuestionsPerPaper = analysisPapers.length > 0 ? totalQuestions / analysisPapers.length : 0;

    // Return extended results
    return NextResponse.json({
      status: 200,
      data: {
        stats,
        overview: {
          totalPapersAllTime,
          papersToday,
          papersThisWeek,
          papersThisMonth,
          avgQuestionsPerPaper: Number(avgQuestionsPerPaper.toFixed(1)),
        },
        charts,
        bank,
        recentActivities,
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
