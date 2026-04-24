"use client";

import { memo, useMemo } from "react";
import DashboardSectionCard from "./DashboardSectionCard";
import PapersTrendChart from "./charts/PapersTrendChart";
import TopUsageBarChart from "./charts/TopUsageBarChart";
import QuestionMixPieChart from "./charts/QuestionMixPieChart";
import type { TeacherDashboardCharts } from "@/types/teacher-dashboard";

type DashboardChartsProps = {
  charts?: TeacherDashboardCharts;
  isLoading?: boolean;
};

function DashboardCharts({ charts, isLoading }: DashboardChartsProps) {
  const topSubjects = useMemo(
    () => (charts?.topSubjectsLast30Days ?? []).map((x) => ({ name: x.name, count: x.count })),
    [charts]
  );

  if (isLoading) return null;
  if (!charts) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-in-up" style={{ animationDelay: "160ms" }}>
      <DashboardSectionCard
        title="Paper Trend"
        description="Papers generated in the last 30 days"
        className="lg:col-span-2"
      >
        <PapersTrendChart data={charts.papersLast30Days} />
      </DashboardSectionCard>

      <DashboardSectionCard title="Question Mix" description="MCQs vs Short vs Long">
        <QuestionMixPieChart data={charts.questionMixLast30Days} />
      </DashboardSectionCard>

      <DashboardSectionCard title="Top Subjects" description="Most used in last 30 days" className="lg:col-span-2">
        <TopUsageBarChart data={topSubjects} />
      </DashboardSectionCard>

      <DashboardSectionCard title="Quick View" description="Boards and classes usage">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Top Boards</p>
            <div className="mt-2 space-y-2">
              {(charts.topBoardsLast30Days ?? []).slice(0, 4).map((b) => (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate pr-2">{b.name}</span>
                  <span className="text-muted-foreground">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top Classes</p>
            <div className="mt-2 space-y-2">
              {(charts.topClassesLast30Days ?? []).slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground truncate pr-2">{c.name}</span>
                  <span className="text-muted-foreground">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardSectionCard>
    </div>
  );
}

export default memo(DashboardCharts);

