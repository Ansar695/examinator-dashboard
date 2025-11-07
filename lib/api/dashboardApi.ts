import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardStatsApi = createApi({
  reducerPath: "dashboardStatsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["DashboardStat"],
  endpoints: (builder) => ({
    geDashboardStats: builder.query<{ success: boolean; data: any }, string>({
      query: () => `/dashboard/stats`,
      providesTags: ["DashboardStat"],
    }),
  }),
});

export const {
  useGeDashboardStatsQuery
} = dashboardStatsApi;
