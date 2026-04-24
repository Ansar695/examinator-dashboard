"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomPagination from "@/components/common/Pagination";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import {
  useGetTeacherNotificationsQuery,
  useMarkAllTeacherNotificationsReadMutation,
  useMarkTeacherNotificationReadMutation,
} from "@/lib/api/notificationsApi";
import { useRouter } from "next/navigation";

type Filter = "all" | "unread";

export default function TeacherNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const queryArgs = useMemo(
    () => ({
      page,
      limit: 20,
      onlyUnread: filter === "unread",
    }),
    [page, filter],
  );

  const { data, isLoading, refetch } = useGetTeacherNotificationsQuery(queryArgs);
  const [markRead] = useMarkTeacherNotificationReadMutation();
  const [markAll, { isLoading: isMarkingAll }] = useMarkAllTeacherNotificationsReadMutation();

  const notifications = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1, unreadCount: 0 };
  const unreadDisplay = Math.max(meta.unreadCount, notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0));

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <Card className="border shadow-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <p className="text-xs text-muted-foreground">{unreadDisplay} unread</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs font-semibold hover:bg-primary/10"
                onClick={() => markAll()}
                disabled={meta.unreadCount === 0 || isMarkingAll}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs
              value={filter}
              onValueChange={(v) => {
                setFilter(v as Filter);
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </Tabs>

            {notifications.length === 0 && !isLoading ? <EmptyNotifications /> : null}

            {notifications.length > 0 ? (
              <div className="divide-y rounded-xl border bg-background">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={async (id) => {
                      await markRead({ id }).unwrap();
                    }}
                    onOpen={(id) => router.push(`/teacher/notifications/${id}`)}
                  />
                ))}
              </div>
            ) : null}
          </CardContent>

          {meta.totalPages > 1 ? (
            <CustomPagination
              currentPage={page}
              currentUsers={notifications.length}
              total={meta.total}
              totalPages={meta.totalPages}
              limit={meta.limit}
              onPageChange={setPage}
              isLoading={isLoading}
              itemName="notifications"
            />
          ) : null}
        </Card>

        {!isLoading ? (
          <div className="text-center">
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
