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

export interface McqPayload {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  marks: number;
}

export interface ShortQuestionPayload {
  questionId: string;
  question: string;
  answer?: string;
  marks: number;
}

export interface LongQuestionPart {
  partLabel: string;
  question: string;
  answer?: string;
  marks: number;
}

export interface LongQuestionPayload {
  questionId: string;
  question: string;
  answer?: string;
  totalMarks?: number;
  parts?: LongQuestionPart[];
}

export interface CreatePaperRequest {
  title: string;
  subjectId: string;
  totalMarks: number;
  mcqs: McqPayload[];
  shortQs: ShortQuestionPayload[];
  longQs: LongQuestionPayload[];
}

export interface GeneratedPaper {
  id: string;
  title: string;
  totalMarks: number;
  userId: string;
  subjectId: string;
  mcqs: McqPayload[];
  shortQs: ShortQuestionPayload[];
  longQs: LongQuestionPayload[];
  createdAt: string;
  updatedAt: string;
}

export const paperGenerationApi = createApi({
  reducerPath: "paperGenerationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["MCQs", "Short", "Long", "GeneratedPaper"],
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

    createPaper: builder.mutation<{ success: boolean; data: GeneratedPaper }, CreatePaperRequest>({
      query: (body) => ({
        url: `/paper-generation/generate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ["GeneratedPaper"],
    }),

    getPaperById: builder.query<{ success: boolean; data: GeneratedPaper }, string>({
      query: (id) => `/paper-generation/generate/${id}`,
      providesTags: ["GeneratedPaper"],
    }),

    updatePaper: builder.mutation<{ success: boolean; data: GeneratedPaper }, { id: string; data: Partial<CreatePaperRequest> }>({
      query: ({ id, data }) => ({
        url: `/paper-generation/generate/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ["GeneratedPaper"],
    }),
  }),
});

export const {
  useGetPaperMCQsQuery,
  useGetPaperShortQsQuery,
  useGetPaperLongQsQuery,
  useCreatePaperMutation,
  useGetPaperByIdQuery,
  useUpdatePaperMutation,
} = paperGenerationApi;
