import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Pagination = { page?: number; limit?: number; search?: string; status?: string; role?: string };

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users", "User"],
  endpoints: (builder) => ({
    listUsers: builder.query<any, any | void>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u: any) => ({ type: "User" as const, id: u.id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }, { type: "Users", id: "LIST" }],
    }),
    approveUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }, { type: "Users", id: "LIST" }],
    }),
    suspendUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }, { type: "Users", id: "LIST" }],
    }),
    inactivateUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}/inactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }, { type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useApproveUserMutation,
  useSuspendUserMutation,
  useInactivateUserMutation,
} = usersApi;


