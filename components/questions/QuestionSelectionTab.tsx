import React from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Shuffle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionItem } from "@/components/questions/QuestionItem";
import { QuestionPagination } from "@/components/questions/QuestionPagination";

interface QuestionSelectionTabProps {
  type: "mcq" | "short" | "long";
  questions: any[];
  isLoading: boolean;
  error: any;
  onRandomSelect: () => void;
  onQuestionSelect: (question: any, selected: boolean) => void;
  selectedQuestions?: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const QuestionSelectionTab: React.FC<QuestionSelectionTabProps> = ({
  type,
  questions,
  isLoading,
  error,
  onRandomSelect,
  onQuestionSelect,
  selectedQuestions = [],
  searchTerm,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getTitle = () => {
    switch (type) {
      case "mcq":
        return "Multiple Choice Questions";
      case "short":
        return "Short Questions";
      case "long":
        return "Long Questions";
      default:
        return "Questions";
    }
  };

  const selectedQuestion = questions.filter((q) =>
    selectedQuestions.includes(q)
  );


  return (
    <TabsContent value={type}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-md md:text-2xl font-semibold text-gray-800">
          {getTitle()}
        </h2>
        <Button
          onClick={onRandomSelect}
          variant="outline"
          className="flex items-center cursor-pointer"
          disabled={isLoading || questions.length === 0}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Random Select
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading questions...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load questions. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && questions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No questions available for the selected chapters.
          </p>
        </div>
      )}

      {/* Questions List */}
      {!isLoading && !error && questions.length > 0 && (
        <div className="bg-gray-100 p-2 md:p-5 rounded-md">
          {questions?.map((question: any) => {
            const isSelected = selectedQuestions?.find((qs) => qs.id === question.id);
            return (
              <QuestionItem
                key={question.id}
                question={question}
                onSelect={onQuestionSelect}
                initialSelected={isSelected ? true : false}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {questions.length > 0 && (
        <QuestionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </TabsContent>
  );
};
