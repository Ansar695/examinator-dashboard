import React from "react";
import { Input } from "@/components/ui/input";
import { EditableQuestion } from "@/components/questions/EditableQuestion";
import { EditableMcq } from "@/components/questions/EditableMcq";

interface Question {
  id: string;
  text: string;
  options?: string[];
  question: string;
  parts?: string[];
  correctAnswer?: number;
  answer?: string;
}

const mcqsOptions = ["a", "b", "c", "d"];

interface PaperQuestionsSectionProps {
  title: string;
  sectionType: "mcq" | "short" | "long";
  questions: Question[];
  marks: Record<string, number | undefined>;
  mcqMarks?: number;
  startIndex: number;
  onQuestionEdit: (
    type: "mcq" | "short" | "long",
    id: string,
    newText: string
  ) => void;
  onMCQOptionEdit?: (
    questionId: string,
    optionIndex: number,
    newText: string
  ) => void;
  onMarksChange: (id: string, value: string) => void;
  onMcqMarksChange?: (value: number | undefined) => void;
  isPreview?: boolean;
  showAnswers?: boolean;
}

export const PaperQuestionsSection: React.FC<PaperQuestionsSectionProps> = ({
  title,
  sectionType,
  questions,
  marks,
  mcqMarks,
  startIndex,
  onQuestionEdit,
  onMCQOptionEdit,
  onMarksChange,
  onMcqMarksChange,
  isPreview = false,
  showAnswers = false,
}) => {
  console.log("PaperQuestionsSection questions:", questions);
  if (questions?.length === 0) return null;

  const getSectionTitle = () => {
    switch (sectionType) {
      case "mcq":
        return "Section A: Multiple Choice Questions";
      case "short":
        return "Section B: Short Questions";
      case "long":
        return "Section C: Long Questions";
      default:
        return title;
    }
  };

  const calculateSectionMarks = () => {
    if (sectionType === "mcq") {
      return mcqMarks || 0;
    }
    return questions?.reduce((sum, q) => {
      if (sectionType === "long" && q.parts && q.parts.length > 0) {
        return sum + (marks[q.id] || 0);
      }
      return sum + (marks[q.id] || 0);
    }, 0);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{getSectionTitle()}</h2>
        {sectionType === "mcq" && onMcqMarksChange && (
          <div className="flex items-center space-x-2">
            <label htmlFor="mcq-marks" className="text-sm font-medium">
              Total Marks:
            </label>
            <Input
              id="mcq-marks"
              type="number"
              className="w-20"
              value={mcqMarks || ""}
              onChange={(e) =>
                onMcqMarksChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
          </div>
        )}
        {sectionType !== "mcq" && (
          <span className="text-sm font-medium">
            Total: {calculateSectionMarks()} Marks
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions?.map((question: Question, index: number) => (
          <div
            key={question?.id}
            className={
              sectionType === "mcq"
                ? "pl-4"
                : "flex justify-between items-start pl-4"
            }
          >
            <div className={sectionType !== "mcq" ? "flex-grow" : ""}>
              <EditableQuestion
                initialText={`${startIndex + index}. ${question?.question}`}
                onSave={(newText) =>
                  onQuestionEdit(
                    sectionType,
                    question?.id,
                    newText?.replace(/^\d+\.\s*/, "")
                  )
                }
              />

              {/* MCQ Options */}
              {sectionType === "mcq" &&
                question?.options &&
                onMCQOptionEdit && (
                  <>
                    <div className="pl-8 mt-2">
                      {question?.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <span>{String.fromCharCode(97 + optionIndex)}</span>
                          <EditableMcq
                            initialText={option}
                            onSave={(newText) =>
                              onMCQOptionEdit(question.id, optionIndex, newText)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {showAnswers && (
                      <div className="ml-6 mt-2 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          <strong>
                            Answer:{" "}
                            <span className="text-md">
                              ({mcqsOptions[question.correctAnswer || 0]}){" "}
                            </span>
                          </strong>{" "}
                          {question.options?.[question.correctAnswer || 0]}
                        </p>
                      </div>
                    )}
                  </>
                )}

              {/* Long Question Parts */}
              {(sectionType === "long" && question?.parts)  && (
                  <>
                    <div className="pl-8 mt-2 space-y-2">
                      {question?.parts?.map((part, partIndex) => (
                        <div
                          key={partIndex}
                          className="flex justify-between items-start"
                        >
                          <EditableQuestion
                            initialText={part}
                            onSave={(newText) => {
                              // Handle part editing if needed
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Marks"
                            className="w-20 ml-4"
                            value={marks[`${question.id}-${partIndex}`] || ""}
                            onChange={(e) =>
                              onMarksChange(
                                `${question.id}-${partIndex}`,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {showAnswers && (
                      <div className="ml-6 mt-2 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          <strong>
                            Answer:{" "}
                          </strong>{" "}
                          {question.answer}
                        </p>
                      </div>
                    )}
                  </>
                )}
            </div>

            {/* Marks Input for Short and Long Questions */}
            {sectionType !== "mcq" && (
              <Input
                type="number"
                placeholder="Marks"
                className="w-20 ml-4"
                value={marks[question?.id] || ""}
                onChange={(e) => onMarksChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
