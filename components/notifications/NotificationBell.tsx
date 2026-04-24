'use client'
import React from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNotifications } from '@/hooks/useNotifications'
import { EmptyNotifications } from './EmptyNotifications'
import { NotificationItem } from './NotificationItem'
import { NotificationDropdownSkeleton } from "./NotificationDropdownSkeleton"
import { useRouter } from "next/navigation"

export const NotificationBell = () => {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    markAsRead, 
    markAllAsRead, 
    refetch,
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) void refetch();
        }}
      >
        <DropdownMenuTrigger>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-full hover:bg-primary transition-all duration-300 cursor-pointer"
          >
            <Bell className="min-h-6 min-w-6" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] font-bold border-2 border-background bg-red-500 shadow-lg"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="z-[100] w-[min(420px,calc(100vw-1rem))] p-0 overflow-hidden border-2 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border-b-2 border-primary/20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-8 text-xs font-semibold hover:bg-primary/10"
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1" />
                      Mark all read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-[500px]">
            {isLoading && notifications.length === 0 ? <NotificationDropdownSkeleton /> : null}
            {!isLoading && notifications.length === 0 ? <EmptyNotifications /> : null}
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className="cursor-pointer p-0 focus:bg-transparent"
                  >
                    <div>
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onOpen={(id) => {
                          router.push(`/teacher/notifications/${id}`);
                        }}
                      />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : null}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenu>
  );
};
