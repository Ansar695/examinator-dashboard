"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TeacherSidebar from "./teacher-sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function TeacherDashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const isPaperBuilder = pathname?.startsWith("/teacher/paper-builder");

  useEffect(() => {
    if (isPaperBuilder) {
      setSidebarCollapsed(true);
    }
  }, [isPaperBuilder]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <TeacherSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main content */}
      <div
        className={`bg-gray-100 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-74"
        }`}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* <Header onMenuClick={() => setSidebarOpen(true)} /> */}
        <main className={`${isPaperBuilder ? "p-0" : "p-4 sm:p-6 lg:p-8"}`}>
          <div
            className={`animate-slide-up ${
              isPaperBuilder ? "max-w-full" : "mx-auto max-w-7xl"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
