"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Library,
  FileText,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useGetChaptersQuery } from "@/lib/api/educationApi"
import { useState } from "react"
import { ChapterForm } from "@/components/chapters/chapter-form"
import { SavedQuestionsList } from "@/components/chapters/saved-questions-list"
import { Question, QuestionGenerationModal } from "@/components/chapters/questions-generation-modal"
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu"
import { LongQuestion, MCQs, ShortQuestion, PaginatedResponse, useGetLongQuestionQuery, useGetMCQsQuestionQuery, useGetShortQuestionQuery, useSaveLongQuestionMutation, useSaveMCQsMutation, useSaveShortQuestionMutation } from "@/lib/api/saveQuestionsApi"
import { useToast } from "@/components/common/CustomToast"
import { payloadFormat } from "@/utils/saveQuestionsPayloadFormat"

export default function ChapterDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [qType, setQType] = useState<string>("mcqs")
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("mcqs")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const { showSuccess, showError, ToastComponent } = useToast();

  const [saveMCQs, { isLoading: isSaving }] = useSaveMCQsMutation()
  const [saveShortQuestion] = useSaveShortQuestionMutation()
  const [saveLongQuestion] = useSaveLongQuestionMutation()

  const { data: mcqsResponse, isLoading: mcqsLoading, error: mcqsError, refetch: refetchMCQs } = useGetMCQsQuestionQuery({
    chapterId: params.id,
    page: selectedQuestionType === "mcqs" ? currentPage : 1,
    limit: pageSize
  })
  const { data: shortResponse, isLoading: shortLoading, error: shortError, refetch: refetchShortQs } = useGetShortQuestionQuery({
    chapterId: params.id,
    page: selectedQuestionType === "short" ? currentPage : 1,
    limit: pageSize
  })
  const { data: longResponse, isLoading: longLoading, error: longError, refetch: refetchLongQs } = useGetLongQuestionQuery({
    chapterId: params.id,
    page: selectedQuestionType === "long" ? currentPage : 1,
    limit: pageSize
  })
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

  const handleSaveQuestions = async(questions: Question[], qType: string) => {
    if(!params?.id) {
      showError("Chapter ID not found")
      return
    }
    setQType(qType)
    
    try {
      const payload = payloadFormat(questions, qType, params?.id)
      let response;
      if(qType === "mcqs") {
        response = await saveMCQs(payload as Partial<MCQs>[]).unwrap()
      }
      if (qType === "short") {
        response = await saveShortQuestion(payload as Partial<ShortQuestion>[]).unwrap()
      }
      if (qType === "long") {
        response = await saveLongQuestion(payload as Partial<LongQuestion>[]).unwrap()
      }
      
      // Show success message
      const insertedCount = response?.insertedCount || payload.length
      showSuccess(`Successfully saved ${insertedCount} questions`)
      
      // Refetch the appropriate questions based on type
      if(qType === "mcqs") {
        refetchMCQs()
      } else if (qType === "short") {
        refetchShortQs()
      } else if (qType === "long") {
        refetchLongQs()
      }
      
      // Close the modal after successful save
      setShowQuestionModal(false)
    } catch (error: any) {
      console.error("Error saving questions:", error)
      
      // Show appropriate error message
      const errorMessage = error?.data?.message || error?.message || "Failed to save questions. Please try again."
      showError(errorMessage)
    }
  }

  const handleUpdateQuestion = async (id: string, updatedQuestion: Question) => {
    // TODO: Implement update API calls
    showError("Update functionality is not yet implemented")
  }

  const handleDeleteQuestion = async (id: string) => {
    // TODO: Implement delete API calls
    showError("Delete functionality is not yet implemented")
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Handle question type change
  const handleQuestionTypeChange = (type: string) => {
    setSelectedQuestionType(type)
    setCurrentPage(1) // Reset to first page when changing type
  }

  // Get the appropriate response based on selected type
  const getCurrentResponse = (): PaginatedResponse<MCQs | ShortQuestion | LongQuestion> | undefined => {
    switch(selectedQuestionType) {
      case "mcqs":
        return mcqsResponse
      case "short":
        return shortResponse
      case "long":
        return longResponse
      default:
        return undefined
    }
  }

  // Check if any questions are loading
  const isQuestionsLoading = mcqsLoading || shortLoading || longLoading

  // Check for any errors
  const questionsError = mcqsError || shortError || longError

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
            <p className="text-slate-600">Chapter details and AI question generation</p>
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{chapterData.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{chapterData.slug}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        Created {new Date(chapterData.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <CustomDropdownMenu 
                    chapterData={{ pdfUrl: chapterData?.pdfUrl, name: chapterData?.name }}
                    handleDownload={handleDownload}
                    setShowEditForm={setShowEditForm}
                  />
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

        {/* AI Question Generation Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  AI Question Generation
                </CardTitle>
                <CardDescription>Generate intelligent questions from chapter content</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowQuestionModal(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Questions
              </Button>
            </div>
          </CardHeader>
        </Card>

        <SavedQuestionsList
          mcqsResponse={mcqsResponse}
          shortResponse={shortResponse}
          longResponse={longResponse}
          selectedQuestionType={selectedQuestionType}
          onQuestionTypeChange={handleQuestionTypeChange}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          isLoading={isQuestionsLoading}
          error={questionsError}
          showSuccess={showSuccess}
          showError={showError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <QuestionGenerationModal
          open={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          onSaveQuestions={handleSaveQuestions}
          classNumber={chapterData.class?.name ?? null}
          chapterName={chapterData.name}
          isSaving={isSaving}
        />

        {/* Edit Form Modal */}
        <ChapterForm chapterData={chapterData} open={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
      {ToastComponent}
    </DashboardLayout>
  )
}