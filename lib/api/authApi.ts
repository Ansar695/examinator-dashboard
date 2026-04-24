import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { UserRole } from "@prisma/client"

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
  userType: "student" | "teacher" | "other"
  age: number
  phone?: string
  institutionName?: string
  profilePicture?: string
  institutionLogo?: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: string
    email: string
    username: string
    name: string
    role: UserRole
    age: number
    phone?: string | null
    institutionName?: string | null
    profilePicture?: string | null
    institutionLogo?: string | null
  }
  redirectUrl: string
}

export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface User {
  id: string
  email: string
  username: string
  name: string
  role: UserRole
  institutionName?: string | null
}

export interface SessionResponse {
  user: User | null
  expires: string
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "/api/auth",
    credentials: "include"
  }),
  tagTypes: ["User", "Session"],
  endpoints: (builder) => ({
    // Register endpoint
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Get current session
    getSession: builder.query<SessionResponse, void>({
      query: () => "/session",
      providesTags: ["Session"],
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/upload/profile",
        method: "POST",
        body: formData,
      }),
    }),

    // Upload institution logo
    uploadInstitutionLogo: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/upload/logo",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useGetSessionQuery,
  useUploadProfilePictureMutation,
  useUploadInstitutionLogoMutation,
} = authApi