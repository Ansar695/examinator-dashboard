import { requireAuth } from "@/lib/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * ✅ Global Search API
 * Searches across Generated Papers, Important Notes, and Board Papers concurrently.
 */
export async function GET(request: Request) {
  try {
    // Standardized authentication using the project's middleware
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // Early return for empty or short queries
    if (!query || query.length < 2) {
      return NextResponse.json({
        papers: [],
        notes: [],
        boardPapers: [],
      });
    }

    const userId = auth.userId;

    // Concurrent database queries for maximum performance
    const [papers, notes, boardPapers] = await Promise.all([
      // 1. Search Teacher's Generated Papers
      prisma.generatedPaper.findMany({
        where: {
          userId: userId,
          title: { contains: query, mode: "insensitive" },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          subject: { select: { name: true } },
          class: { select: { name: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      // 2. Search Important Notes (Title matching)
      prisma.importantNotes.findMany({
        where: {
          notesTitle: { contains: query, mode: "insensitive" },
        },
        select: {
          id: true,
          notesTitle: true,
          file: true,
          board: { select: { name: true } },
          class: { select: { name: true } },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      // 3. Search Board Papers (Name or Year matching)
      prisma.boardPapers.findMany({
        where: {
          OR: [
            { boardName: { contains: query, mode: "insensitive" } },
            { boardYear: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          boardName: true,
          boardYear: true,
          paperFile: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Structured JSON response
    return NextResponse.json({
      papers,
      notes,
      boardPapers,
    });
  } catch (error: any) {
    console.error("Global search API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error", 
        message: error.message || "Failed to execute global search" 
      },
      { status: 500 }
    );
  }
}
