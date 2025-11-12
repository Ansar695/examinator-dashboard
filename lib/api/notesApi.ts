import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Note {
  id: string
  notesTitle: string
  boardId: string
  classId: string
  file: string
  userType: string
  createdAt: string
  updatedAt: string
}

interface CreateNotePayload {
  notesTitle: string
  boardId: string
  classId: string
  userType: string
  file: string
}

interface UpdateNotePayload {
  notesTitle?: string
  boardId?: string
  classId?: string
  userType?: string
  file?: string
}

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    // Get all notes
    getNotes: builder.query<{ success: boolean; data: Note[] }, void>({
      query: () => "/notes",
      providesTags: ["Notes"],
    }),

    // Get notes by class
    getNotesByClass: builder.query<{ success: boolean; data: Note[] }, string>({
      query: (classId) => `/notes?classId=${classId}`,
      providesTags: ["Notes"],
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
  useGetNotesByClassQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi
