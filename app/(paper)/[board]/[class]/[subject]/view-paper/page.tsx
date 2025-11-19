"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PageTransition } from "@/components/shared/Transition";
import { PaperTemplateSelector } from "@/components/questions/PaperTemplates";
import { LanguageSelector } from "@/components/questions/LanguageSelector";
import { PaperPreviewModal } from "@/components/questions/PaperPreviewModal";
import { PaperHeader } from "@/components/paper/PaperHeader";
import { PaperInfo } from "@/components/paper/PaperInfo";
import { PaperQuestionsSection } from "@/components/paper/PaperQuestionsSection";
import { usePaperManagement } from "@/hooks/usePaperManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import DefaultTemplate from "@/components/paper-templates/DefaultTemplate";
import { useGetProfileQuery } from "@/lib/api/profileApi";
import Template1 from "@/components/paper-templates/Template1";

export default function PreviewPaper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const board = params.board as string;
  const classNumber = params.class as string;
  const subject = params.subject as string;
  const paperId = searchParams.get("paperId");
  const subjectId = searchParams.get("subjectId");
  const [currentTemplate, setCurrentTemplate] = useState("default");

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    "punjab-board-standard"
  );
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { data: profileData } = useGetProfileQuery();

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
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id);
    // Apply template styles to the paper
    document.body.style.setProperty(
      "--paper-bg-color",
      template.styles.backgroundColor
    );
    document.body.style.setProperty(
      "--paper-text-color",
      template.styles.textColor
    );
    document.body.style.setProperty(
      "--paper-font-family",
      template.styles.fontFamily
    );
  };

  const handleCurrentTemplateChange = (templateId: string) => {
    setCurrentTemplate(templateId);
  };

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
            currentTemplate={currentTemplate}
            onTemplateChange={handleCurrentTemplateChange}
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
            <>
              {currentTemplate === 'default' && (
                <DefaultTemplate
                  board={board}
                  classNumber={classNumber}
                  subject={subject}
                  paperName={paperName}
                  examTime={examTime}
                  calculatedTotalMarks={calculatedTotalMarks}
                  questions={questions}
                  marks={marks}
                  mcqMarks={mcqMarks}
                  selectedLanguage={selectedLanguage}
                  handleQuestionEdit={handleQuestionEdit}
                  handleMCQOptionEdit={handleMCQOptionEdit}
                  handleMarksChange={handleMarksChange}
                  setMcqMarks={setMcqMarks}
                  setPaperName={setPaperName}
                  setExamTime={setExamTime}
                  paperData={paperData}
                  profileData={profileData?.user}
                />
              )}

              {currentTemplate === 'academic' && (
                <Template1
                  board={board}
                  classNumber={classNumber}
                  subject={subject}
                  paperName={paperName}
                  examTime={examTime}
                  calculatedTotalMarks={calculatedTotalMarks}
                  questions={questions}
                  marks={marks}
                  mcqMarks={mcqMarks}
                  selectedLanguage={selectedLanguage}
                  handleQuestionEdit={handleQuestionEdit}
                  handleMCQOptionEdit={handleMCQOptionEdit}
                  handleMarksChange={handleMarksChange}
                  setMcqMarks={setMcqMarks}
                  setPaperName={setPaperName}
                  setExamTime={setExamTime}
                  paperData={paperData}
                  profileData={profileData?.user}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Paper Preview Modal */}
      <PaperPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        paperData={paperData?.data ? { ...paperData.data, examTime } : null}
        board={board}
        classNumber={classNumber}
        subject={subject}
      />
    </PageTransition>
  );
}
