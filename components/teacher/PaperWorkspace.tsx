"use client";

import { useState } from "react";
import { PaperTemplateSelector, paperTemplates } from "@/components/questions/PaperTemplates";
import { LanguageSelector } from "@/components/questions/LanguageSelector";
import { PaperPreviewModal } from "@/components/questions/PaperPreviewModal";
import { PaperHeader } from "@/components/paper/PaperHeader";
import { PaperInfo } from "@/components/paper/PaperInfo";
import { PaperQuestionsSection } from "@/components/paper/PaperQuestionsSection";
import { usePaperManagement } from "@/hooks/usePaperManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useGetProfileQuery } from "@/lib/api/profileApi";

interface PaperWorkspaceProps {
  board: string;
  classNumber: string;
  subject: string;
  paperId: string | null;
  subjectId?: string | null;
  onBackToSelection?: () => void;
  embedded?: boolean;
}

export default function PaperWorkspace({
  board,
  classNumber,
  subject,
  paperId,
  subjectId,
  onBackToSelection,
  embedded = false,
}: PaperWorkspaceProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    "punjab-board-standard"
  );
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
  const { data: profileData } = useGetProfileQuery();
  const institutionLogo = profileData?.user?.institutionLogo || null;
  const institutionName = profileData?.user?.institutionName || null;
  const handleEditAction = onBackToSelection ?? handleEdit;

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id);
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
  const handleTemplateChangeById = (templateId: string) => {
    const match = paperTemplates.find((t) => t.id === templateId);
    if (match) {
      handleTemplateSelect(match);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background-color: var(--paper-bg-color, white) !important;
            color: var(--paper-text-color, black) !important;
            font-family: var(--paper-font-family, serif) !important;
          }
        }
      `}</style>
      <div
        className={
          embedded
            ? "min-h-screen bg-transparent p-0"
            : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6"
        }
      >
        <div
          className={
            embedded
              ? "w-full h-full bg-white shadow-none rounded-none overflow-hidden"
              : "max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          }
        >
          <PaperHeader
            board={board}
            classNumber={classNumber}
            subject={subject}
            subjectId={subjectId ?? null}
            hasChanges={hasChanges}
            isUpdating={isUpdating}
            onSaveChanges={handleSaveChanges}
            onEdit={handleEditAction}
            onPreview={() => setShowPreviewModal(true)}
            onBackToSelection={onBackToSelection}
            hideBackToSelection={embedded}
            hideEditPaper={embedded}
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

          {(isPaperLoading || isLoadingQuestions) && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading paper...</span>
            </div>
          )}

          {paperError && !isPaperLoading && (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load paper. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!isPaperLoading && !isLoadingQuestions && !paperError && (
            <div
              className="p-6"
              style={{
                backgroundColor: "var(--paper-bg-color, white)",
                color: "var(--paper-text-color, black)",
                fontFamily: "var(--paper-font-family, serif)",
              }}
            >
              <PaperInfo
                board={board}
                classNumber={classNumber}
                subject={subject}
                paperName={paperName}
                examTime={examTime}
                totalMarks={
                  calculatedTotalMarks || paperData?.data?.totalMarks || 0
                }
                institutionLogo={institutionLogo}
                institutionName={institutionName}
                onPaperNameChange={setPaperName}
                onExamTimeChange={setExamTime}
              />

              {selectedLanguage === "both" && (
                <p className="text-sm italic text-center mb-4">
                  Note: Questions are provided in both English and Urdu
                </p>
              )}

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

              <PaperQuestionsSection
                title="Short Questions"
                sectionType="short"
                questions={questions.short}
                marks={marks}
                startIndex={questions.mcq.length + 1}
                onQuestionEdit={handleQuestionEdit}
                onMarksChange={handleMarksChange}
              />

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
    </>
  );
}
