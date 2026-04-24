import type { Notification, NotificationType } from "@prisma/client";
import type { TeacherNotificationDto } from "@/types/notification";

function toClientType(type: NotificationType): TeacherNotificationDto["type"] {
  switch (type) {
    case "SUCCESS":
      return "success";
    case "WARNING":
      return "warning";
    case "ERROR":
      return "error";
    case "INFO":
    default:
      return "info";
  }
}

export function toTeacherNotificationDto(notification: Notification): TeacherNotificationDto {
  return {
    id: notification.id,
    type: toClientType(notification.type),
    title: notification.title,
    message: notification.message,
    href: notification.href,
    createdAt: notification.createdAt.toISOString(),
    read: Boolean(notification.readAt),
  };
}
