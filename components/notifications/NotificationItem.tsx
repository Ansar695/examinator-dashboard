'use client'
import React from 'react'
import { Clock } from "lucide-react";
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getNotificationColors, getNotificationPresentation } from '@/utils/notificationUtils'
import { formatTimestamp } from '@/utils/dateUtils'
import type { TeacherNotificationDto } from "@/types/notification"

interface NotificationItemProps {
  notification: TeacherNotificationDto;
  onMarkAsRead: (id: string) => void;
  onOpen: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onOpen,
}) => {
  const { icon: Icon, color } = getNotificationPresentation(notification.type);
  const colors = getNotificationColors(color, notification.read);

  return (
    <div
      className={cn(
        "group relative p-4 hover:bg-muted/30 transition-all duration-300 cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => {
        if (!notification.read) onMarkAsRead(notification.id);
        onOpen(notification.id);
      }}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-pink-500" />
      )}

      <div className="flex gap-3 pl-2">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 p-2.5 rounded-xl",
          colors.iconBg
        )}>
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-semibold text-sm line-clamp-1",
                !notification.read && "text-foreground",
                notification.read && "text-muted-foreground"
              )}>
                {notification.title}
              </h4>
              <p className={cn(
                "text-sm mt-1 line-clamp-2",
                !notification.read && "text-foreground/80",
                notification.read && "text-muted-foreground"
              )}>
                {notification.message}
              </p>
            </div>
          </div>

          {/* Timestamp and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTimestamp(notification.createdAt)}
            </div>
          </div>

          {/* Type Badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium border",
              colors.border,
              colors.text
            )}
          >
            {notification.type}
          </Badge>
        </div>
      </div>
    </div>
  );
};
