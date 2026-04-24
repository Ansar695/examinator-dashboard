"use client"

import { useMemo } from "react"
import StatCard from "./StatCard"
import RecentPapers from "./RecentPapers"
import { DashboardCardsSkeleton } from "../skeletons/DashboardSkeleton"
import type { TeacherDashboardData } from "@/types/teacher-dashboard"
import DashboardHeader from "./dashboard/DashboardHeader"
import TrendChart from "./dashboard/TrendChart"
import RecentActivity from "./dashboard/RecentActivity"
import { useTeacherDashboardCards } from "@/hooks/useTeacherDashboardCards"

interface DashboardProps {
  isLoading: boolean;
  statsData?: TeacherDashboardData;
}

export default function Dashboard(props: DashboardProps) {
  const { isLoading, statsData } = props;
  const cards = useTeacherDashboardCards(statsData);
  const cardDelays = useMemo(() => cards.map((_, i) => i * 80), [cards]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        subtitle="Manage your paper generation cycles, monitor usage quotas, and track recent activities."
        primaryActionHref="/teacher/paper-builder"
        primaryActionLabel="Create New Paper"
      />

      {/* 1. Stats Grid (Exactly 4 cards now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? 
          Array.from({ length: 4 }).map((_, i) => <DashboardCardsSkeleton key={i} />)
          : 
          cards.map((card, index) => (
            <StatCard
              key={card.key}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              color={card.color}
              delay={cardDelays[index] ?? 0}
            />
          ))
        }
      </div>

      {/* 2. Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart 
            dailyData={statsData?.charts?.dailyTrend ?? []} 
            monthlyData={statsData?.charts?.monthlyTrend ?? []} 
            isLoading={isLoading} 
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity 
            activities={statsData?.recentActivities} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* 3. Last Generated Papers (Exactly as before) */}
      <RecentPapers isLoading={isLoading} papers={statsData?.papers} />
    </div>
  )
}
