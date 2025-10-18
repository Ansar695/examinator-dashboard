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
import { LongQuestion, MCQs, ShortQuestion, PaginatedResponse, useGetLongQuestionQuery, useGetMCQsQuestionQuery, useGetShortQuestionQuery, useSaveLongQuestionMutation, useSaveMCQsMutation, useSaveShortQuestionMutation, useGetPaperMCQsQuery } from "@/lib/api/saveQuestionsApi"
import { useToast } from "@/components/common/CustomToast"
import { payloadFormat } from "@/utils/saveQuestionsPayloadFormat"


// const dummyQuestions = [
//         {
//             "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
//             "question": "Explain how the group number and period number of an element in the periodic table are used to determine the number of its valence electrons and its principal energy level, respectively.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
//             "question": "Discuss the underlying electronic structure principles that link an element's position in the periodic table to its principal energy level and the count of its valence electrons.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
//             "question": "Imagine an unknown element exhibits high reactivity with water, forms a strong basic oxide, and has a relatively low ionization energy. Deduce its likely group, period (if possible), and general nature, justifying your reasoning.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
//             "question": "Outline a systematic approach for identifying an unknown element, including the types of physical and chemical properties that would be crucial for determining its periodic table position and identity.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "e5f6a7b8-c9d0-1234-5678-90abcdef0123",
//             "question": "How does the concept of chemical periodicity allow for the prediction of characteristic chemical properties for elements within the same group? Provide an example.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "f6a7b8c9-d0e1-2345-6789-0abcdef01234",
//             "question": "Choose Group 2 (Alkaline Earth Metals) and Group 16 (Chalcogens). Compare and contrast their characteristic properties, explaining how these properties are predicted based on their respective group positions and electronic configurations.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "a7b8c9d0-e1f2-3456-7890-abcdef012345",
//             "question": "Describe the general trend of atomic radius as one moves across a period from left to right and down a group in the periodic table. Explain the factors responsible for these trends.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "b8c9d0e1-f2a3-4567-8901-bcdef0123456",
//             "question": "Explain the variations in ionic radius observed across a period and down a group in the periodic table. Differentiate between the ionic radii of cations and anions relative to their parent atoms.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "c9d0e1f2-a3b4-5678-9012-cdef01234567",
//             "question": "Define ionization energy and discuss its general trends across a period and down a group in the periodic table. What factors influence these trends?",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "d0e1f2a3-b4c5-6789-0123-def012345678",
//             "question": "What is electron affinity? Explain how electron affinity generally changes as you move from left to right across a period and from top to bottom down a group.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "e1f2a3b4-c5d6-7890-1234-ef0123456789",
//             "question": "Define electronegativity. Describe the periodic trends of electronegativity across periods and down groups, providing reasons for these observed patterns.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "f2a3b4c5-d6e7-8901-2345-f0123456789a",
//             "question": "Analyze the trend of ionization energy for Group 1 elements (alkali metals) as you descend the group. Explain the primary reasons for this observed trend.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "a3b4c5d6-e7f8-9012-3456-0123456789ab",
//             "question": "Compare the first ionization energies of Group 1 elements with those of Group 17 elements across the same period. Account for the significant differences observed.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "b4c5d6e7-f8a9-0123-4567-123456789abc",
//             "question": "Discuss the trend of electron affinity for Group 17 elements (halogens) as you move down the group. Explain the factors that contribute to this specific trend.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "c5d6e7f8-a9b0-1234-5678-23456789abcd",
//             "question": "Explain why Group 1 elements generally have very low electron affinities compared to Group 17 elements. Provide a detailed explanation based on electronic configurations and nuclear charge.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "d6e7f8a9-b0c1-2345-6789-3456789abcde",
//             "question": "Discuss the interplay of nuclear charge, shielding effect, and atomic size in determining the trends of ionization energy and electron affinity across a period.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "e7f8a9b0-c1d2-3456-7890-456789abcdef",
//             "question": "Explain how the concept of effective nuclear charge helps to rationalize the observed decrease in atomic radius across a period and the increase in ionization energy.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "f8a9b0c1-d2e3-4567-8901-56789abcdef0",
//             "question": "An element forms an acidic oxide, is a good oxidizing agent, and exists as a diatomic molecule at room temperature. Predict its likely group and explain how these properties lead to your conclusion.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "a9b0c1d2-e3f4-5678-9012-6789abcdef01",
//             "question": "Explain how the valence electron configuration of an element is the primary determinant for its characteristic chemical properties within a specific group.",
//             "difficulty": "medium",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         },
//         {
//             "id": "b0c1d2e3-f4a5-6789-0123-789abcdef012",
//             "question": "Consider the reactivity of Group 1 elements with water and Group 17 elements with hydrogen. Explain the trends in reactivity within each group, linking them to their respective periodic properties.",
//             "difficulty": "hard",
//             "questionType": "DEFAULT",
//             "answer": "test",
//         }
//     ]
    
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