'use client'
import React from 'react'
import { Check, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getNotificationColors } from '@/utils/notificationUtils'
import { formatTimestamp } from '@/utils/dateUtils'

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const Icon = notification.icon;
  const colors = getNotificationColors(notification?.color, notification.read);

  return (
    <div
      className={cn(
        "group relative p-4 hover:bg-muted/30 transition-all duration-300 cursor-pointer",
        !notification.read && "bg-primary/5"
      )}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
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
              {formatTimestamp(notification.timestamp)}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
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