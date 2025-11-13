import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Note {
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

interface CreateNotePayload {
  notesTitle: string
  boardId: string
  classId: string
  userType: string
  file: string
  fileSize: number
}

interface UpdateNotePayload {
  notesTitle?: string
  boardId?: string
  classId?: string
  userType?: string
  file?: string
  fileSize?: number
}

export interface NotesResponseProps {
  success: boolean
  data: Note[]
  meta: MetaProps
}

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Notes", "Classes"],
  endpoints: (builder) => ({
    getNotes: builder.query<
      { success: boolean; data: Note[]; meta: MetaProps },
      { classId?: string; search?: string; page?: number; limit?: number, userType: string } | void
    >({
      query: (params) => {
        if (!params) return "/notes"
        const queryParams = new URLSearchParams()
        if (params.classId) queryParams.append("classId", params.classId)
        if (params.search) queryParams.append("search", params.search)
        if (params.userType) queryParams.append("userType", params.userType)
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        return `/notes?${queryParams.toString()}`
      },
      providesTags: ["Notes"],
    }),

    getTeacherNotes: builder.query<
      { success: boolean; data: Note[]; meta: MetaProps },
      { classId?: string; search?: string; page?: number; limit?: number, userType: string } | void
    >({
      query: (params) => {
        if (!params) return "/notes/teacher"
        const queryParams = new URLSearchParams()
        if (params.classId) queryParams.append("classId", params.classId)
        if (params.search) queryParams.append("search", params.search)
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        return `/notes/teacher?${queryParams.toString()}`
      },
      providesTags: ["Notes"],
    }),

    // Get notes by class
    getNotesByClass: builder.query<{ success: boolean; data: Note[] }, string>({
      query: (classId) => `/notes?classId=${classId}`,
      providesTags: ["Notes"],
    }),

    getClasses: builder.query<{ success: boolean; data: Class[] }, void>({
      query: () => "/classes",
      providesTags: ["Classes"],
    }),

    // Create note
    createNote: builder.mutation<{ success: boolean; data: Note }, CreateNotePayload>({
      query: (payload) => ({
        url: "/notes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Notes"],
    }),

    // Update note
    updateNote: builder.mutation<{ success: boolean; data: Note }, { id: string; payload: UpdateNotePayload }>({
      query: ({ id, payload }) => ({
        url: `/notes/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Notes"],
    }),

    // Delete note
    deleteNote: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
})

export const {
  useGetNotesQuery,
  useGetTeacherNotesQuery,
  useGetNotesByClassQuery,
  useGetClassesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi
