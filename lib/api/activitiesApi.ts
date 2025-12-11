import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Recent"],
  endpoints: (builder) => ({
    recentActivities: builder.query({
      query: (params) => `/admin/recent-activities/${params.id}`,
      providesTags: ["Recent"],
    }),
  }),
});

export const { useRecentActivitiesQuery } = activitiesApi;
