import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const chapterId = params.chapterId;

    const [mcqs, shorts, longs] = await Promise.all([
      prisma.mCQQuestion.findMany({
        where: { chapterId, subTopic: { not: null } },
        select: { subTopic: true },
      }),
      prisma.shortQuestion.findMany({
        where: { chapterId, subTopic: { not: null } },
        select: { subTopic: true },
      }),
      prisma.longQuestion.findMany({
        where: { chapterId, subTopic: { not: null } },
        select: { subTopic: true },
      }),
    ]);

    const counts: Record<
      string,
      { subTopic: string; mcqs: number; short: number; long: number }
    > = {};

    const bump = (subTopic: string | null | undefined, key: "mcqs" | "short" | "long") => {
      if (!subTopic) return;
      if (!counts[subTopic]) {
        counts[subTopic] = { subTopic, mcqs: 0, short: 0, long: 0 };
      }
      counts[subTopic][key] += 1;
    };

    mcqs.forEach((q) => bump(q.subTopic, "mcqs"));
    shorts.forEach((q) => bump(q.subTopic, "short"));
    longs.forEach((q) => bump(q.subTopic, "long"));

    const data = Object.values(counts).sort((a, b) =>
      a.subTopic.localeCompare(b.subTopic)
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching subtopic counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch subtopic counts" },
      { status: 500 }
    );
  }
}
