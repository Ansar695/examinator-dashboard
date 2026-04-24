import { AuthSessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

export default function PaperLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Toaster />
      <AuthSessionProvider>
        {children}
      </AuthSessionProvider>
    </main>
  );
}
