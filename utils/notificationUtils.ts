import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { TeacherNotificationType } from "@/types/notification";

export const getNotificationPresentation = (type: TeacherNotificationType) => {
  switch (type) {
    case "success":
      return { icon: CheckCircle2, color: "emerald" as const };
    case "warning":
      return { icon: AlertTriangle, color: "amber" as const };
    case "error":
      return { icon: XCircle, color: "red" as const };
    case "info":
    default:
      return { icon: Info, color: "blue" as const };
  }
};

export const getNotificationColors = (color: string, isRead: boolean) => {
  const style = isRead ? "read" : "unread";
  const colorMap: Record<
    string,
    Record<
      "read" | "unread",
      {
        bg: string;
        border: string;
        text: string;
        icon: string;
        iconBg: string;
      }
    >
  > = {
    emerald: {
      unread: {
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
        icon: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      },
      read: {
        bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
        border: "border-emerald-200/60 dark:border-emerald-800/60",
        text: "text-emerald-700/80 dark:text-emerald-300/80",
        icon: "text-emerald-600/80 dark:text-emerald-400/80",
        iconBg: "bg-emerald-100/60 dark:bg-emerald-900/40",
      },
    },
    blue: {
      unread: {
        bg: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-100 dark:bg-blue-900/50",
      },
      read: {
        bg: "bg-blue-50/40 dark:bg-blue-950/20",
        border: "border-blue-200/60 dark:border-blue-800/60",
        text: "text-blue-700/80 dark:text-blue-300/80",
        icon: "text-blue-600/80 dark:text-blue-400/80",
        iconBg: "bg-blue-100/60 dark:bg-blue-900/40",
      },
    },
    amber: {
      unread: {
        bg: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
        icon: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-100 dark:bg-amber-900/50",
      },
      read: {
        bg: "bg-amber-50/40 dark:bg-amber-950/20",
        border: "border-amber-200/60 dark:border-amber-800/60",
        text: "text-amber-700/80 dark:text-amber-300/80",
        icon: "text-amber-600/80 dark:text-amber-400/80",
        iconBg: "bg-amber-100/60 dark:bg-amber-900/40",
      },
    },
    purple: {
      unread: {
        bg: "bg-purple-50 dark:bg-purple-950/30",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-700 dark:text-purple-300",
        icon: "text-purple-600 dark:text-purple-400",
        iconBg: "bg-purple-100 dark:bg-purple-900/50",
      },
      read: {
        bg: "bg-purple-50/40 dark:bg-purple-950/20",
        border: "border-purple-200/60 dark:border-purple-800/60",
        text: "text-purple-700/80 dark:text-purple-300/80",
        icon: "text-purple-600/80 dark:text-purple-400/80",
        iconBg: "bg-purple-100/60 dark:bg-purple-900/40",
      },
    },
    red: {
      unread: {
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-700 dark:text-red-300",
        icon: "text-red-600 dark:text-red-400",
        iconBg: "bg-red-100 dark:bg-red-900/50",
      },
      read: {
        bg: "bg-red-50/40 dark:bg-red-950/20",
        border: "border-red-200/60 dark:border-red-800/60",
        text: "text-red-700/80 dark:text-red-300/80",
        icon: "text-red-600/80 dark:text-red-400/80",
        iconBg: "bg-red-100/60 dark:bg-red-900/40",
      },
    },
  };

  return colorMap[color]?.[style] ?? colorMap.blue[style];
};
