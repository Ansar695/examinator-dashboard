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
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/api/profileApi";
import Image from "next/image";
import { SidebarLogoSkeleton } from "../skeletons/SidebarLogo";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function TeacherSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profileData, isLoading, error, refetch } = useGetProfileQuery();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/teacher" },
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
    // {
    //   id: "settings",
    //   label: "Settings",
    //   icon: Settings,
    //   href: "/teacher/settings",
    // },
  ];

  const getActiveItem = () => {
    // Check for exact match first (for dashboard and root /teacher routes)
    if (pathname === "/teacher" || pathname === "/teacher/dashboard") {
      return "dashboard";
    }
    // Then check for prefix matches for other routes
    const item = menuItems.find((item) => pathname === item.href);
    return item?.id || null;
  };

  const handleLogout = () => {
    router.push("/login");
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
        className={`fixed w-[300px] h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          {isLoading ? (
            <SidebarLogoSkeleton />
          ) : (
            <div className="p-6 border-b border-sidebar-border animate-slide-in-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-sidebar-primary to-accent rounded-lg flex items-center justify-center">
                  {profileData?.user?.institutionLogo ? (
                    <Image
                      src={
                        profileData?.user?.institutionLogo || "/placeholder.svg"
                      }
                      alt="Institution Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <BookOpen
                      size={24}
                      className="text-sidebar-primary-foreground"
                    />
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-lg">
                    {profileData?.user?.institutionName ?? "EduPaper"}
                  </h1>
                  <p className="text-xs text-sidebar-foreground/60">
                    Institution
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2 animate-slide-in-up">
            <Link href="/teacher/profile">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname.startsWith("/teacher/profile")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Profile</span>
              </button>
            </Link>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

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
