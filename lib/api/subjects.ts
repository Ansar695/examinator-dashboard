'use client'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const subjectsApi = createApi({
  reducerPath: 'subjectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["MCQs", "Short", "Long"],
  endpoints: (builder) => ({
    getSubjects: builder.mutation({
      query: ({board, classNumber}) => ({
        url: `/subjects?class=${classNumber}&board=${board}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetSubjectsMutation } = subjectsApi