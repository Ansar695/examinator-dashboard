'use client'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Boards", "Class", "Subject", "Chapter"],
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: () => ({
        url: '/board',
        method: 'GET',
      }),
      providesTags: ["Boards"],
    }),
  }),
})

export const { useGetBoardsQuery } = boardApi