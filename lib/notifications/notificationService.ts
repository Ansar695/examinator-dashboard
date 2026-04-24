import { prisma } from "@/lib/prisma";
import type { NotificationType, Prisma } from "@prisma/client";

type CreateUserNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createUserNotification(input: CreateUserNotificationInput) {
  const { userId, type, title, message, href, metadata } = input;
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      href,
      metadata,
    },
  });
}

type BroadcastToTeachersInput = Omit<CreateUserNotificationInput, "userId"> & {
  institutionName?: string | null;
};

export async function broadcastToTeachers(input: BroadcastToTeachersInput) {
  const { institutionName, type, title, message, href, metadata } = input;

  const teachers = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      ...(institutionName ? { institutionName } : {}),
    },
    select: { id: true },
  });

  if (teachers.length === 0) return { count: 0 };

  const created = await prisma.notification.createMany({
    data: teachers.map((teacher) => ({
      userId: teacher.id,
      type,
      title,
      message,
      href,
      metadata,
    })),
  });

  return { count: created.count };
}

