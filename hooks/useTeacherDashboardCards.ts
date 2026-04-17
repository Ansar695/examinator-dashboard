"use client";

import { useMemo } from "react";
import { BarChart3, BookOpen, CalendarDays, FileText, Library, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TeacherDashboardData } from "@/types/teacher-dashboard";

export type TeacherDashboardCard = {
  key: string;
  title: string;
  value: number | string;
  trend: string;
  icon: LucideIcon;
  color: string;
};

function pluralize(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function useTeacherDashboardCards(data?: TeacherDashboardData) {
  return useMemo<TeacherDashboardCard[]>(() => {
    const quota = data?.stats;
    const overview = data?.overview;
    const bank = data?.bank;

    const daysToRenewal = quota?.daysToRenewal ?? null;
    const renewalText =
      daysToRenewal === null
        ? "No renewal date"
        : daysToRenewal === 0
          ? "Renews today"
          : `Renews in ${pluralize(daysToRenewal, "day")}`;

    const totalQuestions =
      (bank?.totalMCQs ?? 0) + (bank?.totalShortQs ?? 0) + (bank?.totalLongQs ?? 0);

    return [
      {
        key: "quota",
        title: "Monthly Quota",
        value: `${quota?.usedPaper ?? 0}/${quota?.totalPaper ?? 0}`,
        trend: `${quota?.usedPercentage ?? 0}% used`,
        icon: Zap,
        color: "from-blue-500 to-blue-600",
      },
      {
        key: "remaining",
        title: "Remaining",
        value: quota?.remainingPaper ?? 0,
        trend: renewalText,
        icon: CalendarDays,
        color: "from-green-500 to-green-600",
      },
      {
        key: "thisWeek",
        title: "This Week",
        value: overview?.papersThisWeek ?? 0,
        trend: `${overview?.papersToday ?? 0} today`,
        icon: BarChart3,
        color: "from-purple-500 to-purple-600",
      },
      {
        key: "allTime",
        title: "All-Time Papers",
        value: overview?.totalPapersAllTime ?? 0,
        trend: `${overview?.papersThisMonth ?? 0} this month`,
        icon: FileText,
        color: "from-orange-500 to-orange-600",
      },
      {
        key: "avgQuestions",
        title: "Avg Questions/Paper",
        value: overview?.avgQuestionsPerPaper ?? 0,
        trend: "Last 30 days",
        icon: BookOpen,
        color: "from-sky-500 to-sky-600",
      },
      {
        key: "questionBank",
        title: "Question Bank",
        value: totalQuestions,
        trend: `${bank?.totalChapters ?? 0} chapters available`,
        icon: Library,
        color: "from-emerald-500 to-emerald-600",
      },
    ];
  }, [data]);
}
