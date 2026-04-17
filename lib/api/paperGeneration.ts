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
  subTopicsByChapter?: any;
  page?: number;
  limit?: number;
  search?: string;
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
  examTime?: string;
  mcqs: McqPayload[];
  shortQs: ShortQuestionPayload[];
  longQs: LongQuestionPayload[];
}

export interface GeneratedPaper {
  id: string;
  title: string;
  totalMarks: number;
  examTime?: string;
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
      query: ({ chapterIds, subTopicsByChapter, page = 1, limit = 10, search }) => ({
        url: `/paper-generation/mcqs`,
        params: {
          chapterIds,
          ...(subTopicsByChapter && { subTopicsByChapter }),
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["MCQs"],
    }),

    getPaperShortQs: builder.query<PaginatedResponse<ShortQuestion>, QueryParams>({
      query: ({ chapterIds, subTopicsByChapter, page = 1, limit = 10, search }) => ({
        url: `/paper-generation/short-questions`,
        params: {
          chapterIds,
          ...(subTopicsByChapter && { subTopicsByChapter }),
          page,
          limit,
          ...(search && { search }),
        },
      }),
      providesTags: ["Short"],
    }),

    getPaperLongQs: builder.query<PaginatedResponse<LongQuestion>, QueryParams>({
      query: ({ chapterIds, subTopicsByChapter, page = 1, limit = 10, search }) => ({
        url: `/paper-generation/long-questions`,
        params: {
          chapterIds,
          ...(subTopicsByChapter && { subTopicsByChapter }),
          page,
          limit,
          ...(search && { search }),
        },
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

    deletePaper: builder.mutation<{ success: boolean; data: GeneratedPaper }, { id: string; data: Partial<CreatePaperRequest> }>({
      query: ({ id, data }) => ({
        url: `/paper-generation/delete-paper/${id}`,
        method: 'DELETE',
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
  useDeletePaperMutation
} = paperGenerationApi;
