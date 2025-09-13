"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { QuestionEditor } from "./question-editor"

interface Question {
  id: number
  question: string
  type: string
  marks: number
  options?: string[]
  correctAnswer?: string
  expectedAnswer?: string
}

interface SavedQuestionsListProps {
  questions: Question[]
  onUpdateQuestion: (id: number, updatedQuestion: Question) => void
  onDeleteQuestion: (id: number) => void
}

export function SavedQuestionsList({ questions, onUpdateQuestion, onDeleteQuestion }: SavedQuestionsListProps) {
  const [selectedQuestionType, setSelectedQuestionType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredQuestions = questions.filter((q) => {
    const matchesType = selectedQuestionType === "all" || q.type === selectedQuestionType
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const questionsPerPage = 5
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage)
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  )

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Questions</CardTitle>
          <CardDescription>No questions have been saved yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">
            Generate some questions using the AI Question Generation feature above
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Questions ({questions.length})</CardTitle>
        <CardDescription>
          Manage and edit your saved questions • Total marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={selectedQuestionType} onValueChange={setSelectedQuestionType}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mcqs">MCQs</SelectItem>
                <SelectItem value="short">Short Questions</SelectItem>
                <SelectItem value="long">Long Questions</SelectItem>
                <SelectItem value="essay">Essay Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {paginatedQuestions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={(currentPage - 1) * questionsPerPage + index}
              onUpdate={onUpdateQuestion}
              onDelete={onDeleteQuestion}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-slate-600">
              Showing {(currentPage - 1) * questionsPerPage + 1} to{" "}
              {Math.min(currentPage * questionsPerPage, filteredQuestions.length)} of {filteredQuestions.length}{" "}
              questions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
