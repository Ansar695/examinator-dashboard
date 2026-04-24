"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Library, FileText, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { useGetClassesQuery } from "@/lib/api/educationApi"
import { useState } from "react"
import { ClassForm } from "@/components/classes/class-form"

const classTypeColors = {
  PRIMARY: "bg-green-100 text-green-700",
  SECONDARY: "bg-blue-100 text-blue-700",
  HIGHER_SECONDARY: "bg-purple-100 text-purple-700",
  UNDERGRADUATE: "bg-orange-100 text-orange-700",
  POSTGRADUATE: "bg-red-100 text-red-700",
}

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const { data: classes = [], isLoading, error } = useGetClassesQuery()

  const classData = classes.find((c) => c.id === params.id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading class details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !classData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Class not found or error loading details.</p>
          <Link href="/classes">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classes
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
          <Link href="/classes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{classData.name}</h1>
            <p className="text-slate-600">Class details and management</p>
          </div>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Class
          </Button>
        </div>

        {/* Class Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{classData.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{classData.slug}</Badge>
                  <Badge className={`${classTypeColors[classData.type as keyof typeof classTypeColors]}`}>
                    {classData.type.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {new Date(classData.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Board:</span> {classData.board?.name || "No board assigned"}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <Library className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-500">Subjects in this class</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-500">Chapters across all subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage content for this class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Link href={`/subjects/new?classId=${classData.id}`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Library className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </Link>
              <Link href={`/chapters/new?classId=${classData.id}`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Chapter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Modal */}
        <ClassForm classData={classData} open={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
    </DashboardLayout>
  )
}
