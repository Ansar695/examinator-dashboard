import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Board {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: string
  name: string
  slug: string
  type: "PRIMARY" | "SECONDARY" | "HIGHER_SECONDARY" | "UNDERGRADUATE" | "POSTGRADUATE"
  boardId: string
  board?: Board
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  boardId: string
  classId: string
  board?: Board
  class?: Class
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  name: string
  slug: string
  pdfUrl: string
  classId: string
  subjectId: string
  chapterNumber: number
  class?: Class
  subject?: Subject
  createdAt: string
  updatedAt: string
}

export const educationApi = createApi({
  reducerPath: "educationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/admin" }),
  tagTypes: ["Board", "Class", "Subject", "Chapter"],
  endpoints: (builder) => ({
    createChapter: builder.mutation<Chapter, Partial<Chapter>>({
      query: (chapter) => ({
        url: "/chapters",
        method: "POST",
        body: chapter,
      }),
      invalidatesTags: ["Chapter"],
    }),
  }),
})

export const {
  useCreateChapterMutation,
} = educationApi
