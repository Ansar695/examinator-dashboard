"use client";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/api/profileApi";
import Image from "next/image";
import { SidebarLogoSkeleton } from "../skeletons/SidebarLogo";
import { ConfirmLogout } from "./ConfirmLogout";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function TeacherSidebar({
  isOpen,
  setIsOpen,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/teacher" },
    {
      id: "paper-builder",
      label: "Paper Builder",
      icon: Plus,
      href: "/teacher/paper-builder",
    },
    {
      id: "generated-papers",
      label: "Generated Papers",
      icon: FileText,
      href: "/teacher/generated-papers",
    },
    {
      id: "board-papers",
      label: "Board Papers",
      icon: FileText,
      href: "/teacher/all-boards-papers",
    },
    {
      id: "notes",
      label: "Important Notes",
      icon: BookOpen,
      href: "/teacher/important-notes",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/teacher/notifications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: Settings,
      href: "/teacher/profile",
    },
  ];

  const getActiveItem = () => {
    // Check for profile specifically first since it's a subroute that might conflict with others
    if (pathname.startsWith("/teacher/profile")) return "profile";
    
    // Check for exact match for dashboard
    if (pathname === "/teacher" || pathname === "/teacher/dashboard") {
      return "dashboard";
    }
    
    // Check for other routes
    const item = menuItems.find((item) => item.id !== "dashboard" && pathname.startsWith(item.href));
    return item?.id || null;
  };

  const handleLogout = () => {
    setIsLogoutOpen(true)
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: true });
    setIsLoggingOut(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-out z-[60] ${
          collapsed ? "w-20" : "w-[300px]"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-sidebar-border animate-slide-in-left">
            {isLoading ? (
              <SidebarLogoSkeleton />
            ) : (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center p-2">
                    {profileData?.user?.institutionLogo ? (
                      <Image
                        src={profileData?.user?.institutionLogo}
                        alt="Institution Logo"
                        width={48}
                        height={48}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <BookOpen size={24} className="text-primary" />
                    )}
                  </div>
                  {!collapsed && (
                    <div className="min-w-0">
                      <h1 className="font-bold text-base truncate">
                        {profileData?.user?.institutionName ?? "EduPaper"}
                      </h1>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Institution
                      </p>
                    </div>
                  )}
                </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems?.map((item, index) => {
              const Icon = item.icon;
              const isActive = getActiveItem() === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-slide-in-left ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon size={20} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border mt-auto space-y-2 animate-slide-in-up">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-all duration-300 group"
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <div className="flex items-center justify-center min-w-[24px]">
                  {collapsed ? (
                    <ChevronRight size={22} className="text-primary animate-pulse group-hover:text-white" />
                  ) : (
                    <ChevronLeft size={22} className="group-hover:text-white" />
                  )}
                </div>
                {!collapsed && (
                  <span className="font-semibold text-sm tracking-tight group-hover:text-white">Collapse Sidebar</span>
                )}
              </button>
            )}
            
            <button
              className="w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
              onClick={handleLogout}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              {!collapsed && <span className="font-semibold text-sm tracking-tight">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <ConfirmLogout
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
