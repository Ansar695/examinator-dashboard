"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Trash2, Download } from "lucide-react"

interface Note {
  id: string
  title: string
  class: string
  fileName: string
  fileSize: number
  uploadedAt: Date
}

interface NotesListProps {
  notes: Note[]
  onDeleteNote: (id: string) => void
}

const classColors: Record<string, string> = {
  "1": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "2": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
  "3": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
  "4": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  "5": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  "6": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100",
  "7": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  "8": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  "9": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  "10": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  "11": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100",
  "12": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
}

export default function NotesList({ notes, onDeleteNote }: NotesListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">No notes yet</h3>
        <p className="text-sm text-muted-foreground">Start by uploading your first note to get organized</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-semibold text-foreground truncate">{note.title}</h4>
                <Badge className={`flex-shrink-0 ${classColors[note.class] || classColors["1"]}`}>
                  Class {note.class}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{note.fileName}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{note.fileSize.toFixed(2)} MB</span>
                <span>•</span>
                <span>{formatDate(note.uploadedAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Download note"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteNote(note.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
