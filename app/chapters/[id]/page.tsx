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
import { useSaveMCQsMutation } from "@/lib/api/saveQuestionsApi"
import { useToast } from "@/components/common/CustomToast"

const dummyQuestionsMCQs = [
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "question": "What does the period number of an element in the periodic table primarily indicate?",
        "options": [
            "The number of valence electrons.",
            "The principal energy level of its outermost electrons.",
            "The total number of protons in the nucleus.",
            "The element's metallic character."
        ],
        "answer_index": 1,
        "difficulty": "easy"
    },
    {
        "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
        "question": "The group number of an element in the periodic table provides information about which of its atomic properties?",
        "options": [
            "Its atomic mass.",
            "Its melting point.",
            "The number of its valence electrons.",
            "Its isotopic abundance."
        ],
        "answer_index": 2,
        "difficulty": "easy"
    },
    {
        "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
        "question": "Which of the following properties generally decreases as you move from left to right across a period in the periodic table?",
        "options": [
            "Ionization energy.",
            "Electronegativity.",
            "Atomic radius.",
            "Electron affinity."
        ],
        "answer_index": 2,
        "difficulty": "medium"
    },
    {
        "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
        "question": "How does the first ionization energy generally change for elements as one moves down Group 1 of the periodic table?",
        "options": [
            "It increases due to increased nuclear charge.",
            "It decreases due to increased shielding and atomic size.",
            "It remains relatively constant.",
            "It fluctuates unpredictably."
        ],
        "answer_index": 1,
        "difficulty": "medium"
    },
    {
        "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
        "question": "An element 'X' is known to have a very high electronegativity and a strong tendency to gain one electron to form a stable ion. Based on these properties, in which group of the periodic table is element 'X' most likely found?",
        "options": [
            "Group 1",
            "Group 2",
            "Group 17",
            "Group 18"
        ],
        "answer_index": 2,
        "difficulty": "hard"
    }
]

export default function ChapterDetailPage({ params }: { params: { id: string } }) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([])
  const [qType, setQType] = useState<string>("mcqs")
  const { showSuccess, showError, ToastComponent } = useToast();

  const [saveMCQs, { data: saveResponse, isLoading: isSaving }] = useSaveMCQsMutation()
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
    
    try {
      // TODO: Replace dummyQuestionsMCQs with actual questions parameter
      // For now, using dummy data as per the current implementation
      const payload = questions?.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer_index,
        difficulty: (q.difficulty || "medium").toUpperCase(), // Convert to uppercase to match Prisma enum
        chapterId: params.id,
        isActive: q.isActive ?? true,
      }));
      
      const response = await saveMCQs(payload).unwrap()
      
      // Show success message
      const insertedCount = response?.insertedCount || payload.length
      showSuccess(`Successfully saved ${insertedCount} questions`)
      
      // Close the modal after successful save
      setShowQuestionModal(false)
    } catch (error: any) {
      console.error("Error saving questions:", error)
      
      // Show appropriate error message
      const errorMessage = error?.data?.error || error?.message || "Failed to save questions. Please try again."
      showError(errorMessage)
    }
  }

  const handleUpdateQuestion = (id: string, updatedQuestion: Question) => {
    setSavedQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)))
    // TODO: Here you would call your MongoDB API to update question
    console.log("[v0] Updating question in MongoDB:", updatedQuestion)
  }

  const handleDeleteQuestion = (id: string) => {
    setSavedQuestions((prev) => prev.filter((q) => q.id !== id))
    // TODO: Here you would call your MongoDB API to delete question
    console.log("[v0] Deleting question from MongoDB:", id)
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
          questions={savedQuestions}
          qType={qType}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
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