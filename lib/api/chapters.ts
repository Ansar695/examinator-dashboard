'use client'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chaptersApi = createApi({
  reducerPath: 'chaptersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getChapters: builder.mutation({
      query: (subjectId) => ({
        url: `/chapters?subjectId=${subjectId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetChaptersMutation } = chaptersApi