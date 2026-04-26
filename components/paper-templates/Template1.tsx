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
  paperData: any;
  profileData?: any;
  isPreview?: boolean;
  showAnswers?: boolean;
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
  isPreview=false,
  showAnswers=false
}) => {
  const examDetails = {
    studentName: " ",
    rollNum: "",
    subjectName: subject ?? "",
    timeAllowed: examTime ?? "",
    examSyllabus: "CHAP 5",
    totalMarks: String(calculatedTotalMarks ?? 0),
    institutionLogo: profileData?.institutionLogo || "",
    examDate: "",
    className: classNumber ?? "",
    paperCode: "#" + randomThreeDigitCode(),
    isPreview
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto bg-white">

        <ExamHeader
          profileData={profileData}
          examDetails={examDetails}
        />

        <hr className="border-t-2 border-gray-800 my-6" />


        <div className="mb-8">
          <SectionHeader
            title="Multiple Choice Questions"
            instruction="Choose the correct option and mark it on the answer sheet"
          />
          <div className="space-y-4">
            <PaperQuestionsSection
              title="Multiple Choice Questions"
              sectionType="mcq"
              questions={questions?.mcq ?? []}
              marks={marks}
              mcqMarks={mcqMarks}
              startIndex={1}
              onQuestionEdit={handleQuestionEdit}
              onMCQOptionEdit={handleMCQOptionEdit}
              onMarksChange={handleMarksChange}
              onMcqMarksChange={setMcqMarks}
              isPreview={isPreview}
              showAnswers={showAnswers}
            />
          </div>
        <div className="w-full border border-gray-300 mb-6"></div>
        </div>


        <PaperQuestionsSection
          title="Short Questions"
          sectionType="short"
          questions={questions?.short ?? []}
          marks={marks}
          startIndex={(questions?.mcq?.length ?? 0) + 1}
          onQuestionEdit={handleQuestionEdit}
          onMarksChange={handleMarksChange}
          isPreview={isPreview}
          showAnswers={showAnswers}
        />
        <div className="w-full border border-gray-300 mb-6"></div>


        <PaperQuestionsSection
          title="Long Questions"
          sectionType="long"
          questions={questions?.long ?? []}
          marks={marks}
          startIndex={(questions?.mcq?.length ?? 0) + (questions?.short?.length ?? 0) + 1}
          onQuestionEdit={handleQuestionEdit}
          onMarksChange={handleMarksChange}
          isPreview={isPreview}
          showAnswers={showAnswers}
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
