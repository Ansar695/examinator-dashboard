export type TeacherNotificationType = "success" | "info" | "warning" | "error";

export type TeacherNotificationDto = {
  id: string;
  type: TeacherNotificationType;
  title: string;
  message: string;
  href?: string | null;
  createdAt: string;
  read: boolean;
};

