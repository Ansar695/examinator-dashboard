import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get counts for all entities
    const [boardsCount, classesCount, subjectsCount, chaptersCount] = await Promise.all([
      prisma.board.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.chapter.count(),
    ])

    // Get recent boards for activity feed
    const recentBoards = await prisma.board.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    })

    // Get recent chapters for activity feed
    const recentChapters = await prisma.chapter.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        subject: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get recent subjects for activity feed
    const recentSubjects = await prisma.subject.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        class: {
          select: {
            name: true,
          },
        },
      },
    })

    // Calculate percentage changes (mock data for now, can be calculated based on historical data)
    const stats = {
      boards: {
        count: boardsCount,
        change: "+2.1%",
        changeType: "positive" as const,
      },
      classes: {
        count: classesCount,
        change: "+5.4%",
        changeType: "positive" as const,
      },
      subjects: {
        count: subjectsCount,
        change: "+12.5%",
        changeType: "positive" as const,
      },
      chapters: {
        count: chaptersCount,
        change: "+8.2%",
        changeType: "positive" as const,
      },
    }

    // Combine recent activities
    const recentActivities = [
      ...recentBoards.map((board) => ({
        id: board.id,
        type: "board" as const,
        title: `New board "${board.name}" created`,
        createdAt: board.createdAt,
      })),
      ...recentChapters.map((chapter) => ({
        id: chapter.id,
        type: "chapter" as const,
        title: `Chapter "${chapter.name}" uploaded${
          chapter.subject ? ` for ${chapter.subject.name}` : ""
        }`,
        createdAt: chapter.createdAt,
      })),
      ...recentSubjects.map((subject) => ({
        id: subject.id,
        type: "subject" as const,
        title: `Subject "${subject.name}" added${
          subject.class ? ` to ${subject.class.name}` : ""
        }`,
        createdAt: subject.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    return NextResponse.json({
      stats,
      recentActivities,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}