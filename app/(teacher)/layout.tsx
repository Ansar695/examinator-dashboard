import { AuthSessionProvider } from "@/components/providers/session-provider";
import { TeacherDashboardLayout } from "@/components/layout/teacher-layout";
import { ReactNode } from "react";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <TeacherDashboardLayout>
        {children}
      </TeacherDashboardLayout>
    </AuthSessionProvider>
  );
}
