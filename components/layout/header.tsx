"use client";

import { Menu, Bell, Search, LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NotificationBell } from "../notifications/NotificationBell";
import { useGetProfileQuery } from "@/lib/api/profileApi";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();
  const router = useRouter();

  // const handleLogout = async () => {
  //   await signOut({ redirect: false });
  //   router.push("/login");
  // };

  // const handleProfileNavigation = () => {
  //   if(profileData?.user?.role === "TEACHER"){
  //     router.push("/teacher/profile");
  //   } else if (profileData?.user?.role === "STUDENT"){
  //     router.push("/student/profile");
  //   } else {
  //     router.push("/admin/profile");
  //   }
  // }
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
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
        <div className="relative flex flex-1 max-w-[200px] sm:max-w-md mr-2">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-10 sm:h-12 placeholder:text-xs sm:placeholder:text-md w-full border-border bg-muted/50 py-0 pl-10 pr-0 placeholder:text-muted-foreground focus:ring-primary text-foreground text-sm sm:text-lg rounded-lg"
            placeholder="Search boards, classes, subjects..."
            type="search"
            name="search"
          />
        </div>
        {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-border"
            aria-hidden="true"
          />
        <div>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
