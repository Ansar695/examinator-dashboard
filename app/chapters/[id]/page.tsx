"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, Eye, Calendar, GraduationCap, Library, FileText } from "lucide-react"
import Link from "next/link"
import { useGetChaptersQuery } from "@/lib/api/educationApi"
import { useState } from "react"
import { ChapterForm } from "@/components/chapters/chapter-form"

export default function ChapterDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const { data: chapters = [], isLoading, error } = useGetChaptersQuery()

  const chapterData = chapters.find((c) => c.id === params.id)

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
            <p className="mt-2 text-slate-600">Loading chapter details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !chapterData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Chapter not found or error loading details.</p>
          <Link href="/chapters">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/chapters">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{chapterData.name}</h1>
            <p className="text-slate-600">Chapter details and PDF management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(chapterData.pdfUrl, "_blank")}>
              <Eye className="mr-2 h-4 w-4" />
              View PDF
            </Button>
            <Button variant="outline" onClick={() => handleDownload(chapterData.pdfUrl, chapterData.name)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => setShowEditForm(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Chapter
            </Button>
          </div>
        </div>

        {/* Chapter Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-red-100">
                <FileText className="h-10 w-10 text-red-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{chapterData.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{chapterData.slug}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {new Date(chapterData.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Library className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      <span className="font-medium">Subject:</span> {chapterData.subject?.name || "No subject assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      <span className="font-medium">Class:</span> {chapterData.class?.name || "No class assigned"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* PDF Preview */}
        <Card>
          <CardHeader>
            <CardTitle>PDF Preview</CardTitle>
            <CardDescription>View the chapter content directly in your browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] w-full bg-slate-100 rounded-lg flex items-center justify-center">
              <iframe src={chapterData.pdfUrl} className="w-full h-full rounded-lg" title={`${chapterData.name} PDF`} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage this chapter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                variant="outline"
                onClick={() => window.open(chapterData.pdfUrl, "_blank")}
                className="bg-transparent"
              >
                <Eye className="mr-2 h-4 w-4" />
                View in New Tab
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownload(chapterData.pdfUrl, chapterData.name)}
                className="bg-transparent"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => setShowEditForm(true)} className="bg-transparent">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Modal */}
        <ChapterForm chapterData={chapterData} open={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
    </DashboardLayout>
  )
}
