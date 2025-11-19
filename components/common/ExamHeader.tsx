import { InfoField } from "./InfoField";
import { TemplateLogo } from "./TemplateLogo";

export const ExamHeader = ({ profileData, examDetails }: any) => {
  console.log("Exam Details in Header:", profileData);
  return (
    <div className="flex items-center gap-6 mb-6">
      <TemplateLogo logoImg={profileData?.institutionLogo} />
      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center uppercase">
          {profileData?.institutionName || "ABC Institution"}
        </h1>
        <div className="grid grid-cols-4 gap-x-3 gap-y-3 text-sm mb-3">
          <InfoField label="Student Name" value={examDetails.studentName} />
          <InfoField label="Roll Num" value={examDetails.rollNum} />
          <InfoField label="Class Name" value={examDetails.subjectName} />
          <InfoField label="Paper Code" value={examDetails.timeAllowed} />
          <InfoField label="Subject Name" value={examDetails.examSyllabus} />
          <InfoField label="Time Allowed" value={examDetails.totalMarks} />
          <InfoField label="Total Marks" value={examDetails.examDate} />
          <InfoField label="Exam Date" value={examDetails.examDate} />
        </div>
        <InfoField
          label="Exam Syllabus"
          className="w-full"
          value={examDetails.examSyllabus}
        />
      </div>
    </div>
  );
};
