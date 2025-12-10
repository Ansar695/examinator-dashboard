import { BookOpen, FileText, GraduationCap, Library } from "lucide-react";

export const quickActions = [
  {
    title: "Add New Board",
    description: "Create a new educational board",
    href: "/admin/boards",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    title: "Add Class",
    description: "Add a new class to existing board",
    href: "/admin/classes",
    icon: GraduationCap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
  },
  {
    title: "Add Subject",
    description: "Create a new subject for classes",
    href: "/admin/subjects",
    icon: Library,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  },
  {
    title: "Upload Chapter",
    description: "Upload PDF chapters for subjects",
    href: "/admin/chapters",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
]