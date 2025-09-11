"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, GraduationCap, BookOpen } from "lucide-react"
import Link from "next/link"
import { useGetClassesQuery, useDeleteClassMutation } from "@/lib/api/educationApi"
import { ClassForm } from "@/components/classes/class-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const classTypeColors = {
  PRIMARY: "bg-green-100 text-green-700",
  SECONDARY: "bg-blue-100 text-blue-700",
  HIGHER_SECONDARY: "bg-purple-100 text-purple-700",
  UNDERGRADUATE: "bg-orange-100 text-orange-700",
  POSTGRADUATE: "bg-red-100 text-red-700",
}

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [deletingClass, setDeletingClass] = useState<any>(null)

  const { data: classes = [], isLoading, error } = useGetClassesQuery()
  const [deleteClass] = useDeleteClassMutation()

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.board?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (classItem: any) => {
    try {
      await deleteClass(classItem.id).unwrap()
      setDeletingClass(null)
    } catch (error) {
      console.error("Failed to delete class:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading classes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading classes. Please try again.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Classes</h1>
            <p className="text-slate-600">Manage classes across different educational boards</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <GraduationCap className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No classes found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm ? "No classes match your search criteria." : "Get started by creating your first class."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {classItem.slug}
                          </Badge>
                          <Badge
                            className={`text-xs ${classTypeColors[classItem.type as keyof typeof classTypeColors]}`}
                          >
                            {classItem.type.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingClass(classItem)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingClass(classItem)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{classItem.board?.name || "No board assigned"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Created {new Date(classItem.createdAt).toLocaleDateString()}</span>
                      <Link href={`/classes/${classItem.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Form Modal */}
        <ClassForm
          classData={editingClass}
          open={showCreateForm || !!editingClass}
          onClose={() => {
            setShowCreateForm(false)
            setEditingClass(null)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingClass} onOpenChange={() => setDeletingClass(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Class</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingClass?.name}"? This action cannot be undone and will also
                delete all associated subjects and chapters.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingClass && handleDelete(deletingClass)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
