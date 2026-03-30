"use client";

import { useMemo, useState } from "react";
import { PaperTemplateSelector } from "@/components/questions/PaperTemplates";
import { LanguageSelector } from "@/components/questions/LanguageSelector";
import { PaperPreviewModal } from "@/components/questions/PaperPreviewModal";
import { PaperHeader } from "@/components/paper/PaperHeader";
import { PaperInfo } from "@/components/paper/PaperInfo";
import { PaperQuestionsSection } from "@/components/paper/PaperQuestionsSection";
import { usePaperManagement } from "@/hooks/usePaperManagement";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface PaperWorkspaceProps {
  board: string;
  classNumber: string;
  subject: string;
  paperId: string | null;
  subjectId?: string | null;
}

export default function PaperWorkspace({
  board,
  classNumber,
  subject,
  paperId,
  subjectId,
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

  const questionSettings = useMemo(() => {
    try {
      const raw = localStorage.getItem("questionSettings");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const shortSectionTotal =
    questionSettings && Number.isFinite(questionSettings.shortCount)
      ? Math.max(
          0,
          Number(questionSettings.shortCount || 0) -
            Number(questionSettings.shortOptional || 0)
        ) * Number(questionSettings.shortMarks || 0)
      : undefined;
  const longSectionTotal =
    questionSettings && Number.isFinite(questionSettings.longCount)
      ? Math.max(
          0,
          Number(questionSettings.longCount || 0) -
            Number(questionSettings.longOptional || 0)
        ) * Number(questionSettings.longMarks || 0)
      : undefined;

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
                totalMarksOverride={shortSectionTotal}
                startIndex={questions.mcq.length + 1}
                onQuestionEdit={handleQuestionEdit}
                onMarksChange={handleMarksChange}
              />

              <PaperQuestionsSection
                title="Long Questions"
                sectionType="long"
                questions={questions.long}
                marks={marks}
                totalMarksOverride={longSectionTotal}
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
        paperData={paperData?.data ? { ...paperData.data, examTime } : null}
        board={board}
        classNumber={classNumber}
        subject={subject}
      />
    </>
  );
}
