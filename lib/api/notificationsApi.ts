import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TeacherNotificationDto } from "@/types/notification";

export type TeacherNotificationsListResponse = {
  success: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
  };
  data: TeacherNotificationDto[];
};

export type TeacherNotificationResponse = {
  success: boolean;
  data: TeacherNotificationDto;
};

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/teacher/notifications",
    credentials: "include",
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getTeacherNotifications: builder.query<
      TeacherNotificationsListResponse,
      { page?: number; limit?: number; onlyUnread?: boolean } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set("page", String(params.page));
        if (params?.limit) queryParams.set("limit", String(params.limit));
        if (params?.onlyUnread) queryParams.set("onlyUnread", "true");
        const suffix = queryParams.toString();
        return suffix ? `/?${suffix}` : "/";
      },
      providesTags: ["Notifications"],
    }),
    getTeacherNotificationById: builder.query<TeacherNotificationResponse, string>({
      query: (id) => `/${id}`,
      providesTags: ["Notifications"],
    }),
    markTeacherNotificationRead: builder.mutation<TeacherNotificationResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllTeacherNotificationsRead: builder.mutation<{ success: boolean; data: { updated: number } }, void>({
      query: () => ({
        url: "/mark-all-read",
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetTeacherNotificationsQuery,
  useGetTeacherNotificationByIdQuery,
  useMarkTeacherNotificationReadMutation,
  useMarkAllTeacherNotificationsReadMutation,
} = notificationsApi;
