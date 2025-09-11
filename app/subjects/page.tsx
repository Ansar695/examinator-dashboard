"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Library, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useGetSubjectsQuery, useDeleteSubjectMutation } from "@/lib/api/educationApi"
import { SubjectForm } from "@/components/subjects/subject-form"
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

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState<any>(null)
  const [deletingSubject, setDeletingSubject] = useState<any>(null)

  const { data: subjects = [], isLoading, error } = useGetSubjectsQuery()
  const [deleteSubject] = useDeleteSubjectMutation()

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.board?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.class?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (subject: any) => {
    try {
      await deleteSubject(subject.id).unwrap()
      setDeletingSubject(null)
    } catch (error) {
      console.error("Failed to delete subject:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading subjects...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading subjects. Please try again.</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subjects</h1>
            <p className="text-slate-600">Manage subjects across different classes and boards</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Library className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No subjects found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm ? "No subjects match your search criteria." : "Get started by creating your first subject."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Subject
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={subject.imageUrl || "/placeholder.svg"} alt={subject.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
                          {subject.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {subject.slug}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingSubject(subject)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingSubject(subject)}
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
                    <CardDescription className="text-sm leading-relaxed">
                      {subject.description || "No description provided"}
                    </CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{subject.board?.name || "No board"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{subject.class?.name || "No class"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                      <span>Created {new Date(subject.createdAt).toLocaleDateString()}</span>
                      <Link href={`/subjects/${subject.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
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
        <SubjectForm
          subjectData={editingSubject}
          open={showCreateForm || !!editingSubject}
          onClose={() => {
            setShowCreateForm(false)
            setEditingSubject(null)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingSubject} onOpenChange={() => setDeletingSubject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingSubject?.name}"? This action cannot be undone and will also
                delete all associated chapters.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingSubject && handleDelete(deletingSubject)}
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
