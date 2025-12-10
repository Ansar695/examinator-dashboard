"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { BookOpen, GraduationCap, Library, FileText, Home, Settings, X, ChevronDown, Users, StickyNote, HelpCircle } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Overview",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: Home,
    description: "Overview and analytics",
  },
  {
    name: "Course Management",
    icon: BookOpen,
    description: "Manage educational content",
    subItems: [
      {
        name: "Boards",
        href: "/admin/boards",
        icon: BookOpen,
        description: "Manage educational boards",
      },
      {
        name: "Classes",
        href: "/admin/classes",
        icon: GraduationCap,
        description: "Manage classes and grades",
      },
      {
        name: "Subjects",
        href: "/admin/subjects",
        icon: Library,
        description: "Manage subjects and topics",
      },
      {
        name: "Chapters",
        href: "/admin/chapters",
        icon: FileText,
        description: "Manage chapters and PDFs",
      },
    ],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts",
  },
  {
    name: "Add Boards Papers",
    href: "/admin/add-boards-papers",
    icon: FileText,
    description: "Add Boards Papers",
  },
  {
    name: "Add Important Notes",
    href: "/admin/add-important-notes",
    icon: StickyNote,
    description: "Add Important Notes",
  },
  {
    name: "Student Questions Bank",
    href: "/admin/student-questions-bank",
    icon: HelpCircle,
    description: "Student Questions Bank",
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Course Management"])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isSubItemActive = (subItems: any[]) => {
    return subItems.some((subItem) => pathname === subItem.href)
  }

  const renderNavigationItem = (item: any) => {
    if (item.subItems) {
      const isExpanded = expandedItems.includes(item.name)
      const hasActiveSubItem = isSubItemActive(item.subItems)

      return (
        <li key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              hasActiveSubItem
                ? "bg-white text-sidebar-primary"
                : "text-white hover:text-sidebar-primary hover:bg-white/80",
              "group flex w-full items-center justify-between gap-x-3 rounded-lg py-3 px-4 text-sm leading-6 font-medium transition-all duration-200 hover:shadow-sm",
            )}
          >
            <div className="flex items-start justify-start gap-x-3">
              <item.icon
                className={cn(
                  hasActiveSubItem
                    ? "text-sidebar-primary"
                    : "text-white group-hover:text-sidebar-primary",
                  "h-6 w-6 shrink-0 transition-colors",
                )}
                aria-hidden="true"
              />
              <div className="w-full flex flex-col items-start">
                <span className="font-semibold">{item.name}</span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded ? "rotate-180" : "",
                hasActiveSubItem ? "text-sidebar-primary" : "text-muted-foreground"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <ul className="mt-2 ml-4 space-y-1 border-l-2 border-sidebar-border/50 pl-4">
              {item.subItems.map((subItem: any) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.href}
                    className={cn(
                      pathname === subItem.href
                        ? "bg-white text-sidebar-primary-foreground shadow-sm"
                        : "text-white hover:text-sidebar-primary hover:bg-white/80",
                      "group flex gap-x-3 rounded-lg py-2 px-3 text-sm leading-6 font-medium transition-all duration-200",
                    )}
                  >
                    <subItem.icon
                      className={cn(
                        pathname === subItem.href
                          ? "text-sidebar-primary-foreground"
                          : "text-white group-hover:text-sidebar-primary",
                        "h-4 w-4 shrink-0 transition-colors",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm">{subItem.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      )
    }

    return (
      <li key={item.name}>
        <Link
          href={item.href}
          className={cn(
            pathname === item.href
              ? "bg-white text-sidebar-primary shadow-md"
              : "text-white hover:text-sidebar-primary hover:bg-white/80",
            "group flex gap-x-3 rounded-md py-3 px-4 text-sm leading-6 font-medium transition-all duration-200 hover:shadow-sm",
          )}
        >
          <item.icon
            className={cn(
              pathname === item.href
                ? "text-sidebar-primary"
                : "text-white group-hover:text-sidebar-primary",
              "h-6 w-6 shrink-0 transition-colors",
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{item.name}</span>
            {/* <span
              className={cn(
                "text-xs transition-colors",
                pathname === item.href
                  ? "text-sidebar-primary-foreground/80"
                  : "text-muted-foreground group-hover:text-sidebar-primary/70",
              )}
            >
              {item.description}
            </span> */}
          </div>
        </Link>
      </li>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar-primary border-r border-sidebar-border px-6 overflow-hidden pb-4 shadow-lg">
          <div className="flex shrink-0 items-center pt-8 pb-6 border-b border-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                <BookOpen className="h-8 w-8 text-[var(--bg-main)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EduDash</h1>
                <p className="text-sm text-white">Educational Platform</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation?.map((item) => renderNavigationItem(item))}
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
                            ? "bg-white text-sidebar-accent-foreground"
                            : "text-white hover:text-sidebar-primary hover:bg-white",
                          "group flex gap-x-3 rounded-lg py-3 px-4 text-sm leading-6 font-medium transition-all duration-200",
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? "text-sidebar-primary"
                              : "text-white group-hover:text-sidebar-primary",
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
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation?.map((item) => renderNavigationItem(item))}
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
    </>
  )
}