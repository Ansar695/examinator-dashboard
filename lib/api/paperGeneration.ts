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
  chapterIds?: any;
  page?: number;
  limit?: number;
}

export const paperGenerationApi = createApi({
  reducerPath: "paperGenerationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["MCQs", "Short", "Long"],
  endpoints: (builder) => ({
    getPaperMCQs: builder.query<PaginatedResponse<MCQs>, QueryParams>({
      query: ({ chapterIds, page = 1, limit = 10 }) => ({
        url: `/paper-generation/mcqs`,
        params: { chapterIds, page, limit }
      }),
      providesTags: ["Long"],
    }),

    getPaperShortQs: builder.query<PaginatedResponse<ShortQuestion>, QueryParams>({
      query: ({ chapterIds, page = 1, limit = 10 }) => ({
        url: `/paper-generation/short-questions`,
        params: { chapterIds, page, limit }
      }),
      providesTags: ["Long"],
    }),

    getPaperLongQs: builder.query<PaginatedResponse<LongQuestion>, QueryParams>({
      query: ({ chapterIds, page = 1, limit = 10 }) => ({
        url: `/paper-generation/long-questions`,
        params: { chapterIds, page, limit }
      }),
      providesTags: ["Long"],
    }),
  }),
});

export const {
  useGetPaperMCQsQuery,
  useGetPaperShortQsQuery,
  useGetPaperLongQsQuery,
} = paperGenerationApi;
