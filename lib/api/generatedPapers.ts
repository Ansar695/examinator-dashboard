import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { GeneratedPapersQueryArgs, GeneratedPapersResponse } from "@/types/generated-paper";

export const generatedPapersApi = createApi({
  reducerPath: "generatedPapersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["GeneratedPapers"],
  endpoints: (builder) => ({
    getGeneratedPapers: builder.query<
      GeneratedPapersResponse,
      GeneratedPapersQueryArgs | void
    >({
      query: (params) => {
        if (!params) return "/teacher/generated-papers"
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append("search", params.search)
        if (params.subjectIds && params.subjectIds.length > 0) queryParams.append("subjectIds", params.subjectIds.join(","))
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        if (params.sortBy) queryParams.append("sortBy", params.sortBy)
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder)
        return `/teacher/generated-papers?${queryParams.toString()}`
      },
      providesTags: ["GeneratedPapers"],
    }),
  }),
})

export const {
  useGetGeneratedPapersQuery,
} = generatedPapersApi
