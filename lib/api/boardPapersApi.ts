import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { useCreateBoardMutation } from "./educationApi"

export interface BoardPaper {
  id: string
  boardName: string
  boardYear: string
  paperFile: string
  fileSize: number
  createdAt: string
  updatedAt: string
}

export interface MetaProps {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface CreateBoardPaperPayload {
  boardName: string
  boardYear: string
  paperFile: string
  fileSize: number
}

interface UpdateBoardPaperPayload {
  boardName?: string
  boardYear?: string
  paperFile?: string
  fileSize?: number
}

export interface BoardPapersResponseProps {
  success: boolean
  data: BoardPaper[]
  meta: MetaProps
}

export const paperBoardApi = createApi({
  reducerPath: "paperBoardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["BoardPapers"],
  endpoints: (builder) => ({
    getBoardPapers: builder.query<
      { success: boolean; data: BoardPaper[]; meta: MetaProps },
      { boardName?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (!params) return "/baord-papers"
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append("search", params.search)
        if (params.boardName) queryParams.append("boardName", params.boardName)
        if (params.page) queryParams.append("page", params.page.toString())
        if (params.limit) queryParams.append("limit", params.limit.toString())
        return `/board-papers?${queryParams.toString()}`
      },
      providesTags: ["BoardPapers"],
    }),

    getSubBoards: builder.query<
      { success: boolean; data: BoardPaper[]; meta: MetaProps },
      { boardName?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        if (!params) return "/board-papers"
        return `/sub-board-papers`
      },
      providesTags: ["BoardPapers"],
    }),

    // Create note
    createBoardPaper: builder.mutation<{ success: boolean; data: BoardPaper }, CreateBoardPaperPayload>({
      query: (payload) => ({
        url: "/board-papers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["BoardPapers"],
    }),

    // Update note
    updateBoardPaper: builder.mutation<{ success: boolean; data: BoardPaper }, { id: string; payload: UpdateBoardPaperPayload }>({
      query: ({ id, payload }) => ({
        url: `/board-papers/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["BoardPapers"],
    }),

    // Delete note
    deleteBoardPaper: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/board-papers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BoardPapers"],
    })
  }),
})

export const {
  useGetBoardPapersQuery,
  useCreateBoardPaperMutation,
  useUpdateBoardPaperMutation,
  useDeleteBoardPaperMutation,
  useGetSubBoardsQuery
} = paperBoardApi
