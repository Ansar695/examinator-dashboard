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
  }),
});

export const { useSaveMCQsMutation } = questionsApi;
