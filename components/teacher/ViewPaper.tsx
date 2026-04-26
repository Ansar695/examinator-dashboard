'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { PageTransition } from '@/components/shared/Transition'
import { PaperTemplateSelector, paperTemplates } from '@/components/questions/PaperTemplates'
import { LanguageSelector } from '@/components/questions/LanguageSelector'
import { PaperPreviewModal } from '@/components/questions/PaperPreviewModal'
import { PaperHeader } from '@/components/paper/PaperHeader'
import { PaperInfo } from '@/components/paper/PaperInfo'
import { PaperQuestionsSection } from '@/components/paper/PaperQuestionsSection'
import { usePaperManagement } from '@/hooks/usePaperManagement'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { useGetProfileQuery } from "@/lib/api/profileApi";

export default function ViewPaper() {
  const params = useParams()
  const searchParams = useSearchParams()
  const board = params.board as string
  const classNumber = params.class as string
  const subject = params.subject as string
  const paperId = searchParams.get('paperId')
  const subjectId = searchParams.get('subjectId')

  const [selectedTemplateId, setSelectedTemplateId] = useState('punjab-board-standard')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const {
    questions,
    mcqMarks,
    marks,
    examTime,
    paperName,
    isLoadingQuestions,
    hasChanges,
    calculatedTotalMarks,
    paperData,
    isPaperLoading,
    paperError,
    isUpdating,
    handleQuestionEdit,
    handleMCQOptionEdit,
    handleMarksChange,
    handleSaveChanges,
    handleEdit,
    setExamTime,
    setPaperName,
    setMcqMarks,
  } = usePaperManagement({
    paperId,
    board,
    classNumber,
    subject,
  })
  const { data: profileData } = useGetProfileQuery();
  const institutionLogo = profileData?.user?.institutionLogo || null;
  const institutionName = profileData?.user?.institutionName || null;

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id)
    // Apply template styles to the paper
    document.body.style.setProperty('--paper-bg-color', template.styles.backgroundColor)
    document.body.style.setProperty('--paper-text-color', template.styles.textColor)
    document.body.style.setProperty('--paper-font-family', template.styles.fontFamily)
  }
  const handleTemplateChangeById = (templateId: string) => {
    const match = paperTemplates.find((t) => t.id === templateId);
    if (match) {
      handleTemplateSelect(match);
    }
  }

  return (
    <PageTransition>
      <style jsx global>{`
        @media print {
          body {
            background-color: var(--paper-bg-color, white) !important;
            color: var(--paper-text-color, black) !important;
            font-family: var(--paper-font-family, serif) !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <PaperHeader
            board={board}
            classNumber={classNumber}
            subject={subject}
            subjectId={subjectId}
            hasChanges={hasChanges}
            isUpdating={isUpdating}
            onSaveChanges={handleSaveChanges}
            onEdit={handleEdit}
            onPreview={() => setShowPreviewModal(true)}
            currentTemplate={selectedTemplateId}
            onTemplateChange={handleTemplateChangeById}
            institutionLogo={institutionLogo}
            institutionName={institutionName}
          />

          <div className="p-6 bg-gray-100 border-b">
            <div className="flex justify-between items-center">
              <PaperTemplateSelector 
                onSelect={handleTemplateSelect} 
                selectedTemplateId={selectedTemplateId} 
              />
              <LanguageSelector 
                onLanguageChange={setSelectedLanguage} 
                selectedLanguage={selectedLanguage} 
              />
            </div>
          </div>

          {/* Loading State */}
          {(isPaperLoading || isLoadingQuestions) && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading paper...</span>
            </div>
          )}

          {/* Error State */}
          {paperError && !isPaperLoading && (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load paper. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Paper Content */}
          {!isPaperLoading && !isLoadingQuestions && !paperError && (
            <div className="p-6" style={{
              backgroundColor: 'var(--paper-bg-color, white)',
              color: 'var(--paper-text-color, black)',
              fontFamily: 'var(--paper-font-family, serif)'
            }}>
              <PaperInfo
                board={board}
                classNumber={classNumber}
                subject={subject}
                paperName={paperName}
                examTime={examTime}
                totalMarks={calculatedTotalMarks || paperData?.data?.totalMarks || 0}
                institutionLogo={institutionLogo}
                institutionName={institutionName}
                onPaperNameChange={setPaperName}
                onExamTimeChange={setExamTime}
              />

              {selectedLanguage === 'both' && (
                <p className="text-sm italic text-center mb-4">
                  Note: Questions are provided in both English and Urdu
                </p>
              )}

              {/* MCQs Section */}
              <PaperQuestionsSection
                title="Multiple Choice Questions"
                sectionType="mcq"
                questions={questions.mcq}
                marks={marks}
                mcqMarks={mcqMarks}
                startIndex={1}
                onQuestionEdit={handleQuestionEdit}
                onMCQOptionEdit={handleMCQOptionEdit}
                onMarksChange={handleMarksChange}
                onMcqMarksChange={setMcqMarks}
              />

              {/* Short Questions Section */}
              <PaperQuestionsSection
                title="Short Questions"
                sectionType="short"
                questions={questions.short}
                marks={marks}
                startIndex={questions.mcq.length + 1}
                onQuestionEdit={handleQuestionEdit}
                onMarksChange={handleMarksChange}
              />

              {/* Long Questions Section */}
              <PaperQuestionsSection
                title="Long Questions"
                sectionType="long"
                questions={questions.long}
                marks={marks}
                startIndex={questions.mcq.length + questions.short.length + 1}
                onQuestionEdit={handleQuestionEdit}
                onMarksChange={handleMarksChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Paper Preview Modal */}
      <PaperPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        paperData={paperData?.data ?? null}
        board={board}
        classNumber={classNumber}
        subject={subject}
        profileData={profileData?.user ?? profileData}
        questions={questions}
        marks={marks}
        mcqMarks={mcqMarks}
        paperName={paperName}
        examTime={examTime}
        calculatedTotalMarks={calculatedTotalMarks}
      />
    </PageTransition>
  )
}
