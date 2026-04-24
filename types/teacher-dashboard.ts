export type DashboardAlert = {
  id: string;
  type: "info" | "warning" | "danger";
  title: string;
  message: string;
};

export type TeacherQuotaStats = {
  totalPaper: number;
  usedPaper: number;
  remainingPaper: number;
  currentPlan: string;
  expiryDate: string | null;
  usedPercentage: number;
  daysToRenewal: number | null;
};

export type TeacherDashboardOverview = {
  totalPapersAllTime: number;
  papersToday: number;
  papersThisWeek: number;
  papersThisMonth: number;
  papersLast7Days: number;
  avgQuestionsPerPaper: number;
  avgMarksPerPaper: number;
  questionsGeneratedLast30Days: number;
};

export type TeacherDashboardChartPoint = {
  date: string;
  count: number;
};

export type TeacherDashboardTopItem = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

export type TeacherDashboardCharts = {
  papersLast30Days: TeacherDashboardChartPoint[];
  topSubjectsLast30Days: TeacherDashboardTopItem[];
  topClassesLast30Days: Array<TeacherDashboardTopItem & { type: string | null }>;
  topBoardsLast30Days: TeacherDashboardTopItem[];
  questionMixLast30Days: Array<{ name: "MCQs" | "Short" | "Long"; value: number }>;
};

export type TeacherDashboardBank = {
  totalBoards: number;
  totalClasses: number;
  totalSubjects: number;
  totalChapters: number;
  totalMCQs: number;
  totalShortQs: number;
  totalLongQs: number;
};

export type TeacherRecentPaper = {
  id: string;
  title: string;
  createdAt: string;
  totalMarks: number;
  examTime: string | null;
  mcqs: Array<{ marks: number }>;
  shortQs: Array<{ marks: number }>;
  longQs: Array<{ totalMarks: number }>;
  subject: {
    id: string;
    name: string;
    slug: string;
    class: { id: string; name: string; slug: string };
  };
  board: { id: string; name: string; slug: string };
};

export type DashboardActivity = {
  id: string;
  type: "PAPER_GENERATED" | "PLAN_SUBSCRIBED" | "NOTE_ADDED";
  title: string;
  description: string;
  time: string;
};

export type TeacherDashboardData = {
  stats: TeacherQuotaStats & { subscriptionDate: string | null };
  overview: TeacherDashboardOverview;
  charts: {
    dailyTrend: Array<{ date: string; count: number }>;
    monthlyTrend: Array<{ date: string; count: number }>;
    topSubjectsLast30Days: Array<{ id: string; name: string; count: number }>;
    questionMixLast30Days: Array<{ name: string; value: number }>;
  };
  bank: TeacherDashboardBank;
  recentActivities: DashboardActivity[];
  papers: TeacherRecentPaper[];
};

export type TeacherDashboardResponse = {
  status: number;
  data: TeacherDashboardData;
};

