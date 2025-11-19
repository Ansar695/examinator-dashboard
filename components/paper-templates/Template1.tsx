import { randomThreeDigitCode } from "@/utils/paperCodeGenerator";
import { ExamHeader } from "../common/ExamHeader";
import {
  LongAnswerQuestion,
  SectionHeader,
} from "../common/LongAnswerQuestion";
import { MCQQuestion } from "../common/MCQQuestion";
import { ShortAnswerQuestion } from "../common/ShortAnswerQuestion";
import { PaperQuestionsSection } from "../paper/PaperQuestionsSection";

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

const Template1: React.FC<DefaultTemplateProps> = ({
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
  profileData,
}) => {
  const examDetails = {
    studentName: " ",
    rollNum: "",
    subjectName: subject ?? "",
    timeAllowed: "45",
    examSyllabus: "CHAP 5",
    totalMarks: calculatedTotalMarks ?? "0",
    institutionLogo: profileData?.institutionLogo || "",
    examDate: "",
    className: classNumber ?? "",
    paperCode: "#" + randomThreeDigitCode(),
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto bg-white">
        {/* Header Section */}
        <ExamHeader
          profileData={profileData}
          examDetails={examDetails}
        />

        <hr className="border-t-2 border-gray-800 my-6" />

        {/* MCQ Section */}
        <div className="mb-8">
          <SectionHeader
            title="Multiple Choice Questions"
            instruction="Choose the correct option and mark it on the answer sheet"
          />
          <div className="space-y-4">
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
          </div>
        </div>

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

      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:break-before-page {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
};

export default Template1;
