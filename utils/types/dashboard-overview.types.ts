export interface DashboardStats {
  // Legacy fields (if ever provided)
  boards?: { count: number; change: string; changeType: "positive" | "negative" }
  classes?: { count: number; change: string; changeType: "positive" | "negative" }
  subjects?: { count: number; change: string; changeType: "positive" | "negative" }
  chapters?: { count: number; change: string; changeType: "positive" | "negative" }
  // Current API fields
  totalPaper?: number
  usedPaper?: number
  remainingPaper?: number
  currentPlan?: string
  expiryDate?: string | Date | null
  usedPercentage?: number
}

export interface RecentActivity {
  id: string
  type: "board" | "chapter" | "subject"
  title: string
  createdAt: string
}

export interface DashboardData {
  stats: DashboardStats
  recentActivities?: RecentActivity[]
  papers?: any[]
}