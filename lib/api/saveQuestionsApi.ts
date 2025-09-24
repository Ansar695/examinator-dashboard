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
  questionType: 'DEFAULT' | 'ESSAY' | 'OTHER';
  question: string;
  answer: string;
  difficulty: string;
  chapterId: string;
  isActive: boolean;
}

export const questionsApi = createApi({
  reducerPath: "questionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["MCQs", "Short", "Long"],
  endpoints: (builder) => ({
    saveMCQs: builder.mutation<{ success: boolean; insertedCount: number }, Partial<MCQs>[]>({
      query: (payload) => ({
        url: "/save-mcqs",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MCQs"],
    }),

    saveShortQuestion: builder.mutation<{ success: boolean; insertedCount: number }, Partial<ShortQuestion>[]>({
      query: (payload) => ({
        url: "/save-short-questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Short"],
    }),

    saveLongQuestion: builder.mutation<{ success: boolean; insertedCount: number }, Partial<LongQuestion>[]>({
      query: (payload) => ({
        url: "/save-long-questions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Long"],
    }),
  }),
});

export const { useSaveMCQsMutation, useSaveShortQuestionMutation, useSaveLongQuestionMutation } = questionsApi;
