"use client";

import { useMemo } from "react";
import { BarChart3, CalendarDays, FileText, Library, Zap } from "lucide-react";
import type { TeacherDashboardCard } from "@/types/teacher-dashboard";
import type { TeacherDashboardData } from "@/types/teacher-dashboard";
import { format } from "date-fns";

export function useTeacherDashboardCards(data?: TeacherDashboardData) {
  return useMemo<TeacherDashboardCard[]>(() => {
    const stats = data?.stats;
    const overview = data?.overview;
    const bank = data?.bank;

    const subDate = stats?.subscriptionDate ? format(new Date(stats.subscriptionDate), "MMM d, yyyy") : "N/A";
    const renDate = stats?.expiryDate ? format(new Date(stats.expiryDate), "MMM d, yyyy") : "N/A";

    return [
      {
        key: "plan-info",
        title: "Plan Details",
        value: stats?.currentPlan ?? "FREE",
        trend: `Sub: ${subDate} | Ren: ${renDate} | Used: ${stats?.usedPaper ?? 0}`,
        icon: Zap,
        color: "from-blue-500 to-blue-600",
      },
      {
        key: "total-papers",
        title: "Overall Total Papers",
        value: overview?.totalPapersAllTime ?? 0,
        trend: "Total papers generated overall",
        icon: FileText,
        color: "from-orange-500 to-orange-600",
      },
      {
        key: "remaining-quota",
        title: "Current Cycle Remaining",
        value: `${stats?.remainingPaper ?? 0}/${stats?.totalPaper ?? 0}`,
        trend: "Available for current subscription",
        icon: CalendarDays,
        color: "from-green-500 to-green-600",
      },
      {
        key: "question-bank",
        title: "Question Bank Size",
        value: (bank?.totalMCQs ?? 0) + (bank?.totalShortQs ?? 0) + (bank?.totalLongQs ?? 0),
        trend: "Total questions available in bank",
        icon: Library,
        color: "from-emerald-500 to-emerald-600",
      },
    ];
  }, [data]);
}
