"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ConfirmLogout } from "@/components/layout/ConfirmLogout";

export function TopbarLogout() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ redirect: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" />
      </Button>

      <ConfirmLogout
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
}

