import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { NextResponse } from "next/server";
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

// ---------- DAILY ----------
export function generateWeekDays() {
  const start = dayjs().startOf("isoWeek");
  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = start.add(i, "day");
    days.push({
      date: d.format("YYYY-MM-DD"),
      name: d.format("dddd"),
      userRegistered: 0,
    });
  }

  return days;
}

// ---------- WEEKS OF CURRENT MONTH ----------
export function generateWeeksOfCurrentMonth() {
  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");

  const weeks = [];
  let cursor = startOfMonth.startOf("week"); // start from the week's beginning

  let weekCounter = 1;

  while (cursor.isBefore(endOfMonth)) {
    const weekStart = cursor;
    const weekEnd = cursor.endOf("week");

    // only consider weeks that overlap the current month
    if (weekStart.isBefore(endOfMonth) && weekEnd.isAfter(startOfMonth)) {
      weeks.push({
        name: `Week ${weekCounter}`,
        startDate: weekStart.format("YYYY-MM-DD"),
        endDate: weekEnd.format("YYYY-MM-DD"),
        userRegistered: 0,
      });
      weekCounter++;
    }

    cursor = cursor.add(1, "week");
  }

  return weeks;
}

// ---------- MONTHS OF CURRENT YEAR ----------
export function generateMonthsOfYear() {
  const year = dayjs().year();
  return Array.from({ length: 12 }, (_, index) => {
    const start = dayjs(`${year}-${index + 1}-01`).startOf("month");
    const end = start.endOf("month");

    return {
      monthNumber: index + 1,
      name: start.format("MMMM"),
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
      userRegistered: 0,
    };
  });
}


async function getDaily() {
  const start = dayjs().startOf("isoWeek").toDate();
  const end = dayjs().endOf("isoWeek").toDate();

  const res: any = await prisma.$runCommandRaw({
    aggregate: "users",
    pipeline: [
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          count: { $sum: 1 },
        },
      },
    ],
    cursor: {},
  });

  const raw = res.cursor.firstBatch;
  const days = generateWeekDays();

  raw.forEach((item: any) => {
    const date = item._id.date;
    const d = days.find((x) => x.date === date);
    if (d) d.userRegistered = item.count;
  });

  return days;
}


async function getWeekly() {
  const monthStart = dayjs().startOf("month").toDate();
  const monthEnd = dayjs().endOf("month").toDate();

  const res: any = await prisma.$runCommandRaw({
    aggregate: "users",
    pipeline: [
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: {
          _id: { week: { $week: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ],
    cursor: {},
  });

  const raw = res.cursor.firstBatch;
  const weeks = generateWeeksOfCurrentMonth();

  raw.forEach((item: any) => {
    // MongoDB week number (1–53)
    const mongoWeek = item._id.week;

    const matchedWeek = weeks.find((w) => {
      const startWeekNo = dayjs(w.startDate).week();
      return startWeekNo === mongoWeek;
    });

    if (matchedWeek) {
      matchedWeek.userRegistered = item.count;
    }
  });

  return weeks;
}



async function getMonthly() {
  const year = dayjs().year();

  const yearStart = dayjs(`${year}-01-01`).toDate();
  const yearEnd = dayjs(`${year}-12-31`).toDate();

  const res: any = await prisma.$runCommandRaw({
    aggregate: "users",
    pipeline: [
      {
        $match: {
          createdAt: { $gte: yearStart, $lte: yearEnd },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ],
    cursor: {},
  });

  const raw = res.cursor.firstBatch;
  const months = generateMonthsOfYear();

  raw.forEach((item: any) => {
    const index = item._id.month - 1;
    months[index].userRegistered = item.count;
  });

  return months;
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter"); // daily, weekly, monthly

  if (!filter) {
    return NextResponse.json({ error: "filter is required" }, { status: 400 });
  }

  if (filter === "daily") return NextResponse.json(await getDaily());
  if (filter === "weekly") return NextResponse.json(await getWeekly());
  if (filter === "monthly") return NextResponse.json(await getMonthly());

  return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
}