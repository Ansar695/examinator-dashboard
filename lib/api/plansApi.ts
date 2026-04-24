import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    subscribePlan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/subscription/subscribe-plan",
        method: "POST",
        body: data,
      }),
    }),

    subscriptionHistory: builder.query({
      query: (params) => `/admin/subscription-history/${params.id}?page=${params?.page}&limit=${params?.limit ?? 10}`,
      providesTags: ["Profile"],
    }),
  }),
});

export const { useSubscribePlanMutation, useSubscriptionHistoryQuery } = plansApi;
