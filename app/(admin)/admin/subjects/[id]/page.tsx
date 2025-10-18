"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, FileText, Calendar, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useGetSubjectsQuery } from "@/lib/api/educationApi"
import { useState } from "react"
import { SubjectForm } from "@/components/subjects/subject-form"

export default function SubjectDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const { data: subjects = [], isLoading, error } = useGetSubjectsQuery()

  const subjectData = subjects.find((s) => s.id === params.id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading subject details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !subjectData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Subject not found or error loading details.</p>
          <Link href="/subjects">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subjects
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
          <Link href="/subjects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{subjectData.name}</h1>
            <p className="text-slate-600">Subject details and management</p>
          </div>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Subject
          </Button>
        </div>

        {/* Subject Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={subjectData.imageUrl || "/placeholder.svg"} alt={subjectData.name} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                  {subjectData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{subjectData.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{subjectData.slug}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {new Date(subjectData.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription className="mt-3 text-base leading-relaxed">
                  {subjectData.description || "No description provided for this subject."}
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      <span className="font-medium">Board:</span> {subjectData.board?.name || "No board assigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      <span className="font-medium">Class:</span> {subjectData.class?.name || "No class assigned"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-500">Chapters in this subject</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage content for this subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Link href={`/chapters/new?subjectId=${subjectData.id}&classId=${subjectData.classId}`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Modal */}
        <SubjectForm subjectData={subjectData} open={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
    </DashboardLayout>
  )
}
