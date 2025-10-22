"use client"

import { useState } from "react"
import { Menu, X, FileText, BarChart3, Settings, LogOut, BookOpen, Plus } from "lucide-react"
import { Button } from "../ui/button"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function TeacherSidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "papers", label: "Generated Papers", icon: FileText },
    { id: "create", label: "Create Paper", icon: Plus },
    { id: "library", label: "Question Library", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
          <div className="p-6 border-b border-sidebar-border animate-slide-in-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">EduPaper</h1>
                <p className="text-xs text-sidebar-foreground/60">Institution</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 animate-slide-in-left ${
                    activeItem === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-2 animate-slide-in-up">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
              <Settings size={20} />
              <span className="font-medium">Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30 animate-fade-in" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
