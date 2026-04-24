import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/authMiddleware";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    // Count total generated papers
    const totalGeneratedPapers = await prisma.generatedPaper.count();

    const totalMCQs = await prisma.mCQQuestion.count();
    const totalShortQs = await prisma.shortQuestion.count();
    const totalLongQs = await prisma.longQuestion.count();
    const totalRevenue = 0; // Coming soon

    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
    
    const stats = {
      users: totalUsers || 0,
      teachers: totalTeachers,
      students: totalStudents,
      totalRevenue,
      mcqs: totalMCQs,
      shorts: totalShortQs,
      longs: totalLongQs,
      totalGeneratedPapers: totalGeneratedPapers,
    };

    // Return both results
    return NextResponse.json({
      status: 200,
      data: stats
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
