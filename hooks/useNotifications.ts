'use client'

import { useCallback, useMemo } from "react";
import {
  useGetTeacherNotificationsQuery,
  useMarkAllTeacherNotificationsReadMutation,
  useMarkTeacherNotificationReadMutation,
} from "@/lib/api/notificationsApi";

export function useNotifications(limit = 5) {
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = useGetTeacherNotificationsQuery(
    {
      page: 1,
      limit,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      pollingInterval: 20000,
      skipPollingIfUnfocused: true,
    },
  );

  const [markRead, { isLoading: isMarkingRead }] =
    useMarkTeacherNotificationReadMutation();
  const [markAll, { isLoading: isMarkingAll }] =
    useMarkAllTeacherNotificationsReadMutation();

  const notifications = useMemo(() => data?.data ?? [], [data?.data]);
  const unreadCount = useMemo(() => {
    const metaUnread = data?.meta?.unreadCount ?? 0;
    if (metaUnread > 0) return metaUnread;
    const fallbackUnread = notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);
    return fallbackUnread;
  }, [data?.meta?.unreadCount, notifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      await markRead({ id }).unwrap();
    },
    [markRead],
  );

  const markAllAsRead = useCallback(async () => {
    await markAll().unwrap();
    await refetch();
  }, [markAll, refetch]);

  return {
    notifications,
    unreadCount,
    isLoading: isFetching || isMarkingRead || isMarkingAll,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}
