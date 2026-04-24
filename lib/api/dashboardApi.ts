import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TeacherDashboardResponse } from "@/types/teacher-dashboard";

export const dashboardStatsApi = createApi({
  reducerPath: "dashboardStatsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["DashboardStat"],
  endpoints: (builder) => ({
    getTeacherDashboard: builder.query<TeacherDashboardResponse, void>({
      query: () => `/dashboard/stats`,
      providesTags: ["DashboardStat"],
    }),
  }),
});

export const {
  useGetTeacherDashboardQuery
} = dashboardStatsApi;
