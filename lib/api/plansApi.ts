import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    subscribePlan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/subscription/subscribe-plan",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubscribePlanMutation } = plansApi;
