"use client"

import type React from "react"
import { useState } from "react"
import TeacherSidebar from "./teacher-sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function TeacherDashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <TeacherSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
    
          {/* Main content */}
          <div className="lg:pl-72 bg-gray-100">
            {/* <Header onMenuClick={() => setSidebarOpen(true)} /> */}
            <main className="p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl animate-slide-up">{children}</div>
            </main>
          </div>
        </div>
  )
}
