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
  class?: Class
  subject?: Subject
  createdAt: string
  updatedAt: string
}

export const educationApi = createApi({
  reducerPath: "educationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Board", "Class", "Subject", "Chapter"],
  endpoints: (builder) => ({
    // Board endpoints
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      providesTags: ["Board"],
    }),
    getBoardById: builder.query<Board, string>({
      query: (id) => `/boards/${id}`,
      providesTags: ["Board"],
    }),
    createBoard: builder.mutation<Board, Partial<Board>>({
      query: (board) => ({
        url: "/boards",
        method: "POST",
        body: board,
      }),
      invalidatesTags: ["Board"],
    }),
    updateBoard: builder.mutation<Board, { id: string; board: Partial<Board> }>({
      query: ({ id, board }) => ({
        url: `/boards/${id}`,
        method: "PUT",
        body: board,
      }),
      invalidatesTags: ["Board"],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board"],
    }),

    // Class endpoints
    getClasses: builder.query<Class[], void>({
      query: () => "/classes",
      providesTags: ["Class"],
    }),
    getClassesByBoard: builder.query<Class[], string>({
      query: (boardId) => `/classes?boardId=${boardId}`,
      providesTags: ["Class"],
    }),
    createClass: builder.mutation<Class, Partial<Class>>({
      query: (classData) => ({
        url: "/classes",
        method: "POST",
        body: classData,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation<Class, { id: string; class: Partial<Class> }>({
      query: ({ id, class: classData }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body: classData,
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),

    // Subject endpoints
    getSubjects: builder.query<Subject[], void>({
      query: () => "/subjects",
      providesTags: ["Subject"],
    }),
    getSubjectsByClass: builder.query<Subject[], { boardId: string; classId: string }>({
      query: ({ boardId, classId }) => `/subjects?boardId=${boardId}&classId=${classId}`,
      providesTags: ["Subject"],
    }),
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (subject) => ({
        url: "/subjects",
        method: "POST",
        body: subject,
      }),
      invalidatesTags: ["Subject"],
    }),
    updateSubject: builder.mutation<Subject, { id: string; subject: Partial<Subject> }>({
      query: ({ id, subject }) => ({
        url: `/subjects/${id}`,
        method: "PUT",
        body: subject,
      }),
      invalidatesTags: ["Subject"],
    }),
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),

    // Chapter endpoints
    getChapters: builder.query<Chapter[], void>({
      query: () => "/chapters",
      providesTags: ["Chapter"],
    }),
    getChaptersBySubject: builder.query<Chapter[], { classId: string; subjectId: string }>({
      query: ({ classId, subjectId }) => `/chapters?classId=${classId}&subjectId=${subjectId}`,
      providesTags: ["Chapter"],
    }),
    createChapter: builder.mutation<Chapter, Partial<Chapter>>({
      query: (chapter) => ({
        url: "/chapters",
        method: "POST",
        body: chapter,
      }),
      invalidatesTags: ["Chapter"],
    }),
    updateChapter: builder.mutation<Chapter, { id: string; chapter: Partial<Chapter> }>({
      query: ({ id, chapter }) => ({
        url: `/chapters/${id}`,
        method: "PUT",
        body: chapter,
      }),
      invalidatesTags: ["Chapter"],
    }),
    deleteChapter: builder.mutation<void, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chapter"],
    }),
  }),
})

export const {
  useGetBoardsQuery,
  useGetBoardByIdQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
  useGetClassesQuery,
  useGetClassesByBoardQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetSubjectsQuery,
  useGetSubjectsByClassQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetChaptersQuery,
  useGetChaptersBySubjectQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} = educationApi
