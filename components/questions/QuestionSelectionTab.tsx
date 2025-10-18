import React from 'react';
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Shuffle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionItem } from "@/components/questions/QuestionItem";

interface QuestionSelectionTabProps {
  type: 'mcq' | 'short' | 'long';
  questions: any[];
  isLoading: boolean;
  error: any;
  onRandomSelect: () => void;
  onQuestionSelect: (id: string, selected: boolean) => void;
}

export const QuestionSelectionTab: React.FC<QuestionSelectionTabProps> = ({
  type,
  questions,
  isLoading,
  error,
  onRandomSelect,
  onQuestionSelect,
}) => {
  const getTitle = () => {
    switch (type) {
      case 'mcq':
        return 'Multiple Choice Questions';
      case 'short':
        return 'Short Questions';
      case 'long':
        return 'Long Questions';
      default:
        return 'Questions';
    }
  };

  return (
    <TabsContent value={type}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {getTitle()}
        </h2>
        <Button
          onClick={onRandomSelect}
          variant="outline"
          className="flex items-center"
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
          <span className="ml-3 text-gray-600">
            Loading questions...
          </span>
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
        <div>
          {questions.map((question: any) => (
            <QuestionItem
              key={question.id}
              question={question}
              onSelect={onQuestionSelect}
            />
          ))}
        </div>
      )}
    </TabsContent>
  );
};