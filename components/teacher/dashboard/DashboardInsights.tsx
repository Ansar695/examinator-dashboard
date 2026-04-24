"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import type { TeacherDashboardBank, TeacherQuotaStats, TeacherDashboardOverview } from "@/types/teacher-dashboard";

type DashboardInsightsProps = {
  stats?: TeacherQuotaStats;
  overview?: TeacherDashboardOverview;
  bank?: TeacherDashboardBank;
  isLoading?: boolean;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" });
}

function DashboardInsights({ stats, overview, bank, isLoading }: DashboardInsightsProps) {
  if (isLoading) return null;
  if (!stats || !overview || !bank) return null;

  const totalQuestions = bank.totalMCQs + bank.totalShortQs + bank.totalLongQs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-in-up" style={{ animationDelay: "120ms" }}>
      <Card className="p-5 border border-border lg:col-span-1">
        <p className="text-xs text-muted-foreground">Plan</p>
        <p className="text-lg font-semibold text-foreground mt-1 capitalize">{stats.currentPlan.toLowerCase()}</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Renewal</span>
            <span className="text-foreground">{formatDate(stats.expiryDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Remaining</span>
            <span className="text-foreground">{stats.remainingPaper}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Used</span>
            <span className="text-foreground">{stats.usedPaper}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 border border-border lg:col-span-1">
        <p className="text-xs text-muted-foreground">Last 30 Days</p>
        <p className="text-lg font-semibold text-foreground mt-1">{overview.questionsGeneratedLast30Days.toLocaleString()} questions</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg questions/paper</span>
            <span className="text-foreground">{overview.avgQuestionsPerPaper}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg marks/paper</span>
            <span className="text-foreground">{overview.avgMarksPerPaper}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Papers this month</span>
            <span className="text-foreground">{overview.papersThisMonth}</span>
          </div>
        </div>
      </Card>

      <Card className="p-5 border border-border lg:col-span-1">
        <p className="text-xs text-muted-foreground">Question Bank</p>
        <p className="text-lg font-semibold text-foreground mt-1">{totalQuestions.toLocaleString()} total questions</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chapters</span>
            <span className="text-foreground">{bank.totalChapters}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">MCQs</span>
            <span className="text-foreground">{bank.totalMCQs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Short</span>
            <span className="text-foreground">{bank.totalShortQs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Long</span>
            <span className="text-foreground">{bank.totalLongQs}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default memo(DashboardInsights);

