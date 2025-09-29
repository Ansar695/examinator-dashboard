import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MCQs {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  chapterId: string;
  isActive: boolean;
}

export interface ShortQuestion {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  chapterId: string;
  isActive: boolean;
}

export interface LongQuestion {
  id: string;
  questionType: "DEFAULT" | "ESSAY" | "OTHER";
  question: string;
  answer: string;
  difficulty: string;
  chapterId: string;
  isActive: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface QueryParams {
  chapterId?: string;
  chapterIds?: string[];
  page?: number;
  limit?: number;
}

export const questionsApi = createApi({
  reducerPath: "questionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["MCQs", "Short", "Long"],
  endpoints: (builder) => ({
    saveMCQs: builder.mutation<
      { success: boolean; insertedCount: number },
      Partial<MCQs>[]
    >({
      query: (payload) => ({
        url: "/save-mcqs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MCQs"],
    }),

    saveShortQuestion: builder.mutation<
      { success: boolean; insertedCount: number },
      Partial<ShortQuestion>[]
    >({
      query: (payload) => ({
        url: "/save-short-questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Short"],
    }),

    saveLongQuestion: builder.mutation<
      { success: boolean; insertedCount: number },
      Partial<LongQuestion>[]
    >({
      query: (payload) => ({
        url: "/save-long-questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Long"],
    }),

    getMCQsQuestion: builder.query<PaginatedResponse<MCQs>, QueryParams>({
      query: ({ chapterId, page = 1, limit = 10 }) => ({
        url: `/save-mcqs/${chapterId}`,
        params: { page, limit }
      }),
      providesTags: ["MCQs"],
    }),

    getShortQuestion: builder.query<PaginatedResponse<ShortQuestion>, QueryParams>({
      query: ({ chapterId, page = 1, limit = 10 }) => ({
        url: `/save-short-questions/${chapterId}`,
        params: { page, limit }
      }),
      providesTags: ["Short"],
    }),

    getLongQuestion: builder.query<PaginatedResponse<LongQuestion>, QueryParams>({
      query: ({ chapterId, page = 1, limit = 10 }) => ({
        url: `/save-long-questions/${chapterId}`,
        params: { page, limit }
      }),
      providesTags: ["Long"],
    }),

    getPaperMCQs: builder.query<PaginatedResponse<LongQuestion>, QueryParams>({
      query: ({ chapterIds, page = 1, limit = 10 }) => ({
        url: `/paper-generation/short-questions`,
        params: { chapterIds, page, limit }
      }),
      providesTags: ["Long"],
    }),
  }),
});

export const {
  useSaveMCQsMutation,
  useSaveShortQuestionMutation,
  useSaveLongQuestionMutation,
  useGetMCQsQuestionQuery,
  useGetShortQuestionQuery,
  useGetLongQuestionQuery,
  useGetPaperMCQsQuery,
} = questionsApi;
