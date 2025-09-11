"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, MoreHorizontal, Edit, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"
import { useGetBoardsQuery, useDeleteBoardMutation } from "@/lib/api/educationApi"
import { BoardForm } from "@/components/boards/board-form"
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

export default function BoardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBoard, setEditingBoard] = useState<any>(null)
  const [deletingBoard, setDeletingBoard] = useState<any>(null)

  const { data: boards = [], isLoading, error } = useGetBoardsQuery()
  const [deleteBoard] = useDeleteBoardMutation()

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (board: any) => {
    try {
      await deleteBoard(board.id).unwrap()
      setDeletingBoard(null)
    } catch (error) {
      console.error("Failed to delete board:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading boards...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Error loading boards. Please try again.</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Boards</h1>
            <p className="text-slate-600">Manage your educational boards and curricula</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Board
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Boards Grid */}
        {filteredBoards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No boards found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm ? "No boards match your search criteria." : "Get started by creating your first board."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Board
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBoards.map((board) => (
              <Card key={board.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={board.logoUrl || "/placeholder.svg"} alt={board.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {board.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{board.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {board.slug}
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
                        <DropdownMenuItem onClick={() => setEditingBoard(board)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingBoard(board)}
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
                  <CardDescription className="text-sm leading-relaxed">
                    {board.description || "No description provided"}
                  </CardDescription>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
                    <Link href={`/boards/${board.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      View Details →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Form Modal */}
        <BoardForm
          board={editingBoard}
          open={showCreateForm || !!editingBoard}
          onClose={() => {
            setShowCreateForm(false)
            setEditingBoard(null)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingBoard} onOpenChange={() => setDeletingBoard(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Board</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingBoard?.name}"? This action cannot be undone and will also
                delete all associated classes, subjects, and chapters.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingBoard && handleDelete(deletingBoard)}
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
