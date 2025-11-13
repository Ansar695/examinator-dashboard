import React from 'react'
import { Bell } from 'lucide-react'

export const EmptyNotifications = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-full bg-muted/50 mb-4">
        <Bell className="h-12 w-12 text-muted-foreground" />
      </div>
      <h4 className="font-semibold text-lg mb-2">No notifications</h4>
      <p className="text-sm text-muted-foreground text-center">
        You're all caught up! We'll notify you when something new happens.
      </p>
    </div>
  );
};