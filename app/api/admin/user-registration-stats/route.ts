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

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: { createdAt: true },
  });

  const days = generateWeekDays();

  users.forEach((user) => {
    const date = dayjs(user.createdAt).format("YYYY-MM-DD");
    const found = days.find((d) => d.date === date);
    if (found) found.userRegistered += 1;
  });

  return days;
}



async function getWeekly() {
  const monthStart = dayjs().startOf("month").toDate();
  const monthEnd = dayjs().endOf("month").toDate();

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    select: { createdAt: true },
  });

  const weeks = generateWeeksOfCurrentMonth();

  users.forEach((user) => {
    const userWeek = dayjs(user.createdAt).isoWeek();

    const matchedWeek = weeks.find((w) => {
      return dayjs(w.startDate).isoWeek() === userWeek;
    });

    if (matchedWeek) matchedWeek.userRegistered += 1;
  });

  return weeks;
}




async function getMonthly() {
  const yearStart = dayjs().startOf("year").toDate();
  const yearEnd = dayjs().endOf("year").toDate();

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: yearStart,
        lte: yearEnd,
      },
    },
    select: { createdAt: true },
  });

  const months = generateMonthsOfYear();

  users.forEach((user) => {
    const monthIndex = dayjs(user.createdAt).month(); // 0–11
    months[monthIndex].userRegistered += 1;
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