'use client'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const classesApi = createApi({
  reducerPath: 'classesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getClasses: builder.mutation({
      query: (boardId) => ({
        url: `/classes?board=${boardId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetClassesMutation } = classesApi