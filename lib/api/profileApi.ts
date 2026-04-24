// lib/api/profileApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  age: number | null;
  role: "STUDENT" | "TEACHER" | "OTHER";
  institutionName: string | null;
  institutionLogo: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface ProfileUpdateData {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  age?: number;
  institutionName?: string;
  profilePicture?: string;
  institutionLogo?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  user: User;
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),

    // Update user profile
    updateProfile: builder.mutation<ProfileUpdateResponse, ProfileUpdateData>({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Delete user account
    deleteAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/profile",
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} = profileApi;