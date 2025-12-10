import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminDashboardStatsApi = createApi({
  reducerPath: "adminDashboardStatsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["AdminDashboardStat", "RecentActivity", "UserRegStat"],
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query({
      query: () => `/admin/dashboard`,
      providesTags: ["AdminDashboardStat"],
    }),

    getRecentActivities: builder.query({
      query: () => `/admin/recent-activities`,
      providesTags: ["RecentActivity"],
    }),

    getUsersRegStats: builder.query({
      query: (params) => `/admin/user-registration-stats?${params}`,
      providesTags: ["UserRegStat"],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetRecentActivitiesQuery,
  useGetUsersRegStatsQuery,
} = adminDashboardStatsApi;
