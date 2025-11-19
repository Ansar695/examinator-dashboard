import React from "react";
import { PaperQuestionsSection } from "../paper/PaperQuestionsSection";
import { PaperInfo } from "../paper/PaperInfo";

interface DefaultTemplateProps {
  board: string;
  classNumber: string;
  subject: string;
  paperName: string;
  examTime: string;
  calculatedTotalMarks: number;
  questions: {
    mcq: any[];
    short: any[];
    long: any[];
  };
  marks: any;
  mcqMarks: any;
  selectedLanguage: string;
  handleQuestionEdit: (
    type: "mcq" | "short" | "long",
    id: string,
    newText: string
  ) => void;
  handleMCQOptionEdit: (
    questionId: string,
    optionIndex: number,
    newText: string
  ) => void;
  handleMarksChange: (id: string, value: string) => void;
  setMcqMarks: (value: number | undefined) => void;
  setPaperName: (name: string) => void;
  setExamTime: (time: string) => void;
  paperData?: {
    data: {
      totalMarks: number;
    };
  };
    profileData?: any;
}

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({
  board,
  classNumber,
  subject,
  paperName,
  examTime,
  calculatedTotalMarks,
  questions,
  marks,
  mcqMarks,
  selectedLanguage,
  handleQuestionEdit,
  handleMCQOptionEdit,
  handleMarksChange,
  setMcqMarks,
  setPaperName,
  setExamTime,
  paperData,
  profileData
}) => {
  return (
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
        totalMarks={calculatedTotalMarks || paperData?.data?.totalMarks || 0}
        onPaperNameChange={setPaperName}
        onExamTimeChange={setExamTime}
      />

      {selectedLanguage === "both" && (
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
  );
};

export default DefaultTemplate;
