"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Save, X } from "lucide-react"

interface Question {
  id: number
  question: string
  type: string
  marks: number
  options?: string[]
  correctAnswer?: string
  expectedAnswer?: string
}

interface QuestionEditorProps {
  question: Question
  index: number
  onUpdate: (id: number, updatedQuestion: Question) => void
  onDelete: (id: number) => void
  showActions?: boolean
}

export function QuestionEditor({ question, index, onUpdate, onDelete, showActions = true }: QuestionEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState(question)

  const handleSave = () => {
    onUpdate(question.id, editedQuestion)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedQuestion(question)
    setIsEditing(false)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(editedQuestion.options || [])]
    newOptions[optionIndex] = value
    setEditedQuestion({ ...editedQuestion, options: newOptions })
  }

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {question.type}
            </Badge>
            <span className="text-sm text-slate-500">Q{index + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Label htmlFor={`marks-${question.id}`} className="text-xs text-slate-500">
                  Marks:
                </Label>
                <Input
                  id={`marks-${question.id}`}
                  type="number"
                  value={editedQuestion.marks}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, marks: Number(e.target.value) })}
                  className="w-16 h-7 text-xs"
                  min="1"
                />
              </div>
            ) : (
              <Badge variant="secondary">{question.marks} marks</Badge>
            )}
            {showActions && (
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={handleSave} className="h-7 w-7 p-0">
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 w-7 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="h-7 w-7 p-0">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(question.id)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-3">
          {isEditing ? (
            <Textarea
              value={editedQuestion.question}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
              className="min-h-[60px] resize-none"
              placeholder="Enter question text..."
            />
          ) : (
            <p className="font-medium text-slate-900">{question.question}</p>
          )}
        </div>

        {/* MCQ Options */}
        {question.type === "mcqs" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 w-6">{String.fromCharCode(65 + optIndex)}.</span>
                {isEditing ? (
                  <Input
                    value={option}
                    onChange={(e) => updateOption(optIndex, e.target.value)}
                    className="flex-1 h-8"
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                  />
                ) : (
                  <div
                    className={`flex-1 text-sm p-2 rounded border ${
                      option === question.correctAnswer ? "bg-green-50 border-green-200" : "bg-slate-50"
                    }`}
                  >
                    {option}
                    {option === question.correctAnswer && (
                      <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-700">
                        Correct
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="mt-2">
                <Label className="text-xs text-slate-500">Correct Answer:</Label>
                <select
                  value={editedQuestion.correctAnswer}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, correctAnswer: e.target.value })}
                  className="ml-2 text-xs border rounded px-2 py-1"
                >
                  {editedQuestion.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {String.fromCharCode(65 + idx)}. {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Expected Answer for non-MCQ questions */}
        {question.type !== "mcqs" && question.expectedAnswer && (
          <div className="mt-3 p-3 bg-slate-50 rounded border">
            <Label className="text-xs text-slate-500 mb-1 block">Expected Answer:</Label>
            {isEditing ? (
              <Textarea
                value={editedQuestion.expectedAnswer}
                onChange={(e) => setEditedQuestion({ ...editedQuestion, expectedAnswer: e.target.value })}
                className="min-h-[80px] resize-none text-sm"
                placeholder="Enter expected answer..."
              />
            ) : (
              <p className="text-sm text-slate-700">{question.expectedAnswer}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
