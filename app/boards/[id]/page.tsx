"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, GraduationCap, Library, Calendar } from "lucide-react"
import Link from "next/link"
import { useGetBoardByIdQuery } from "@/lib/api/educationApi"
import { useState } from "react"
import { BoardForm } from "@/components/boards/board-form"

export default function BoardDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const { data: board, isLoading, error } = useGetBoardByIdQuery(params.id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading board details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !board) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Board not found or error loading details.</p>
          <Link href="/boards">
            <Button variant="outline" className="mt-4 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Boards
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
          <Link href="/boards">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{board.name}</h1>
            <p className="text-slate-600">Board details and management</p>
          </div>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Board
          </Button>
        </div>

        {/* Board Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={board.logoUrl || "/placeholder.svg"} alt={board.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                  {board.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{board.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{board.slug}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {new Date(board.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription className="mt-3 text-base leading-relaxed">
                  {board.description || "No description provided for this board."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <GraduationCap className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{board.classes?.length || 0}</div>
              <p className="text-xs text-slate-500">Active classes in this board</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <Library className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{board.subjects?.length || 0}</div>
              <p className="text-xs text-slate-500">Subjects across all classes</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        {board.classes && board.classes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>Classes associated with this board</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {board.classes.map((classItem: any) => (
                  <div key={classItem.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{classItem.name}</p>
                      <p className="text-xs text-slate-500">{classItem.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Form Modal */}
        <BoardForm board={board} open={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
    </DashboardLayout>
  )
}
