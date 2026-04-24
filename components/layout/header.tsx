"use client";

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "../notifications/NotificationBell";
import { useGetProfileQuery } from "@/lib/api/profileApi";
import GlobalSearch from "./GlobalSearch";
import { TopbarLogout } from "@/components/layout/TopbarLogout";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground lg:hidden transition-colors rounded-md hover:bg-muted"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

      <div className="flex items-center justify-end flex-1 gap-x-4">
        <GlobalSearch />
        
        {/* Separator */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-border"
          aria-hidden="true"
        />
        
        <div>
          <NotificationBell />
        </div>

        <div>
          <TopbarLogout />
        </div>
      </div>
    </header>
  );
}
