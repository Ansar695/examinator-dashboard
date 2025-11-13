import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface GeneratedPapers {
  id: string
  notesTitle: string
  boardId: string
  classId: string
  class: any
  file: string
  fileSize: number
  userType: string
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: string
  name: string
}

export interface MetaProps {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface NotesResponseProps {
  success: boolean
  data: GeneratedPapers[]
  meta: MetaProps
}

export const generatedPapersApi = createApi({
  reducerPath: "generatedPapersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["GeneratedPapers"],
  endpoints: (builder) => ({
    getGeneratedPapers: builder.query<
      { success: boolean; data: GeneratedPapers[]; meta: MetaProps },
      { search?: string; page?: number; limit?: number, subjectIds: any } | void
    >({
      query: (params) => {
        if (!params) return "/notes"
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append("search", params.search)
        if (params.subjectIds) queryParams.append("subjectIds", params?.subjectIds)
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        return `/teacher/generated-papers?${queryParams.toString()}`
      },
      providesTags: ["GeneratedPapers"],
    }),
  }),
})

export const {
  useGetGeneratedPapersQuery,
} = generatedPapersApi
