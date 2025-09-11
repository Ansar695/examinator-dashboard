"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Download,
  Eye,
  GraduationCap,
  Library,
} from "lucide-react"
import Link from "next/link"
import { useGetChaptersQuery, useDeleteChapterMutation } from "@/lib/api/educationApi"
import { ChapterForm } from "@/components/chapters/chapter-form"
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

export default function ChaptersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState<any>(null)
  const [deletingChapter, setDeletingChapter] = useState<any>(null)

  const { data: chapters = [], isLoading, error } = useGetChaptersQuery()
  const [deleteChapter] = useDeleteChapterMutation()

  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.class?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (chapter: any) => {
    try {
      await deleteChapter(chapter.id).unwrap()
      setDeletingChapter(null)
    } catch (error) {
      console.error("Failed to delete chapter:", error)
    }
  }

  const handleDownload = (pdfUrl: string, chapterName: string) => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${chapterName}.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading chapters...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading chapters. Please try again.</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chapters</h1>
            <p className="text-slate-600">Manage PDF chapters across different subjects and classes</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Chapter
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search chapters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chapters Grid */}
        {filteredChapters.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No chapters found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm
                  ? "No chapters match your search criteria."
                  : "Get started by uploading your first chapter."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Chapter
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChapters.map((chapter) => (
              <Card key={chapter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{chapter.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {chapter.slug}
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
                        <DropdownMenuItem onClick={() => handleDownload(chapter.pdfUrl, chapter.name)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(chapter.pdfUrl, "_blank")}>
                          <Eye className="mr-2 h-4 w-4" />
                          View PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingChapter(chapter)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingChapter(chapter)}
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
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Library className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{chapter.subject?.name || "No subject"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{chapter.class?.name || "No class"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                      <span>Created {new Date(chapter.createdAt).toLocaleDateString()}</span>
                      <Link href={`/chapters/${chapter.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
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
        <ChapterForm
          chapterData={editingChapter}
          open={showCreateForm || !!editingChapter}
          onClose={() => {
            setShowCreateForm(false)
            setEditingChapter(null)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingChapter} onOpenChange={() => setDeletingChapter(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingChapter?.name}"? This action cannot be undone and will
                permanently remove the chapter and its PDF file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingChapter && handleDelete(deletingChapter)}
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
