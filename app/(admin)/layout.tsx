import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ReactNode } from "react";

export default function PaperLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <AuthSessionProvider>
        {children}
      </AuthSessionProvider>
    </main>
  );
}
