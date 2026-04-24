"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/utils/dateUtils";
import {
  useGetTeacherNotificationByIdQuery,
  useMarkTeacherNotificationReadMutation,
} from "@/lib/api/notificationsApi";
import { getNotificationColors, getNotificationPresentation } from "@/utils/notificationUtils";

export default function TeacherNotificationDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data, isLoading } = useGetTeacherNotificationByIdQuery(id, { skip: !id });
  const [markRead] = useMarkTeacherNotificationReadMutation();

  const notification = data?.data;

  const presentation = useMemo(() => {
    if (!notification) return null;
    return getNotificationPresentation(notification.type);
  }, [notification]);

  const colors = useMemo(() => {
    if (!notification || !presentation) return null;
    return getNotificationColors(presentation.color, notification.read);
  }, [notification, presentation]);

  useEffect(() => {
    if (!notification || notification.read) return;
    markRead({ id: notification.id });
  }, [markRead, notification]);

  if (!id) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Button variant="ghost" className="gap-2" onClick={() => router.push("/teacher/notifications")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-xl">{isLoading ? "Loading..." : notification?.title}</CardTitle>
              {notification ? (
                <Badge variant="outline" className="text-xs">
                  {notification.type}
                </Badge>
              ) : null}
            </div>
            {notification ? (
              <p className="text-xs text-muted-foreground">{formatTimestamp(notification.createdAt)}</p>
            ) : null}
          </CardHeader>

          {notification && presentation && colors ? (
            <CardContent className="space-y-4">
              <div
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4",
                  colors.bg,
                  colors.border,
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 p-2.5 rounded-xl",
                    colors.iconBg,
                  )}
                >
                  <presentation.icon className={cn("h-5 w-5", colors.icon)} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{notification.message}</p>
                </div>
              </div>

              {notification.href ? (
                <Button className="gap-2" onClick={() => router.push(notification.href!)}>
                  <ExternalLink className="h-4 w-4" />
                  Open related page
                </Button>
              ) : null}
            </CardContent>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
