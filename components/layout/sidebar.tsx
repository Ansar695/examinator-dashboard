"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, GraduationCap, Library, FileText, Home, Settings, X } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and analytics",
  },
  {
    name: "Boards",
    href: "/boards",
    icon: BookOpen,
    description: "Manage educational boards",
  },
  {
    name: "Classes",
    href: "/classes",
    icon: GraduationCap,
    description: "Manage classes and grades",
  },
  {
    name: "Subjects",
    href: "/subjects",
    icon: Library,
    description: "Manage subjects and topics",
  },
  {
    name: "Chapters",
    href: "/chapters",
    icon: FileText,
    description: "Manage chapters and PDFs",
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4 shadow-lg">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">EduDash</h1>
                <p className="text-sm text-muted-foreground">Educational Platform</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md border-r-4 border-primary"
                            : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50",
                          "group flex gap-x-3 rounded-l-lg py-3 px-4 text-sm leading-6 font-medium transition-all duration-200 hover:shadow-sm",
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? "text-sidebar-primary-foreground"
                              : "text-muted-foreground group-hover:text-sidebar-primary",
                            "h-5 w-5 shrink-0 transition-colors",
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <span
                            className={cn(
                              "text-xs transition-colors",
                              pathname === item.href
                                ? "text-sidebar-primary-foreground/80"
                                : "text-muted-foreground group-hover:text-sidebar-primary/70",
                            )}
                          >
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <ul role="list" className="-mx-2 space-y-1">
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50",
                          "group flex gap-x-3 rounded-lg py-3 px-4 text-sm leading-6 font-medium transition-all duration-200",
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? "text-sidebar-accent-foreground"
                              : "text-muted-foreground group-hover:text-sidebar-primary",
                            "h-5 w-5 shrink-0 transition-colors",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">EduDash</h1>
                <p className="text-sm text-muted-foreground">Educational Platform</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* ... existing navigation code ... */}
        </div>
      </div>
    </>
  )
}
