"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter, AlertCircle, Loader2 } from "lucide-react";
import { QuestionEditor } from "./question-editor";
import { Question } from "./questions-generation-modal";
import { MCQs, ShortQuestion, LongQuestion, PaginatedResponse } from "@/lib/api/saveQuestionsApi";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SavedQuestionsListProps {
  mcqsResponse?: PaginatedResponse<MCQs>;
  shortResponse?: PaginatedResponse<ShortQuestion>;
  longResponse?: PaginatedResponse<LongQuestion>;
  selectedQuestionType: string;
  onQuestionTypeChange: (type: string) => void;
  onUpdateQuestion: (id: string, updatedQuestion: Question) => void;
  onDeleteQuestion: (id: string) => void;
  isLoading: boolean;
  error: any;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SavedQuestionsList({
  mcqsResponse,
  shortResponse,
  longResponse,
  selectedQuestionType,
  onQuestionTypeChange,
  onUpdateQuestion,
  onDeleteQuestion,
  isLoading,
  error,
  showSuccess,
  showError,
  currentPage,
  onPageChange,
}: SavedQuestionsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get current response based on selected type
  const getCurrentResponse = (): PaginatedResponse<MCQs | ShortQuestion | LongQuestion> | undefined => {
    switch(selectedQuestionType) {
      case "mcqs":
        return mcqsResponse as PaginatedResponse<MCQs | ShortQuestion | LongQuestion> | undefined;
      case "short":
        return shortResponse as PaginatedResponse<MCQs | ShortQuestion | LongQuestion> | undefined;
      case "long":
        return longResponse as PaginatedResponse<MCQs | ShortQuestion | LongQuestion> | undefined;
      default:
        return undefined;
    }
  };

  const currentResponse = getCurrentResponse();

  // Convert API data to Question format for display
  const convertToQuestionFormat = useMemo(() => {
    const questions: Question[] = [];

    if (!currentResponse?.data) return questions;

    if (selectedQuestionType === "mcqs" && mcqsResponse?.data) {
      mcqsResponse.data.forEach((mcq) => {
        questions.push({
          id: mcq.id,
          question: mcq.question,
          difficulty: mcq.difficulty,
          options: mcq.options,
          answer_index: mcq.correctAnswer.toString(),
          questionType: "mcqs",
        });
      });
    } else if (selectedQuestionType === "short" && shortResponse?.data) {
      shortResponse.data.forEach((sq) => {
        questions.push({
          id: sq.id,
          question: sq.question,
          difficulty: sq.difficulty,
          answer: sq.answer,
          questionType: "short",
        });
      });
    } else if (selectedQuestionType === "long" && longResponse?.data) {
      longResponse.data.forEach((lq) => {
        questions.push({
          id: lq.id,
          question: lq.question,
          difficulty: lq.difficulty,
          answer: lq.answer,
          questionType: "long",
        });
      });
    }

    return questions;
  }, [mcqsResponse, shortResponse, longResponse, selectedQuestionType, currentResponse]);

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    return convertToQuestionFormat.filter((q) => {
      const matchesSearch = q.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [convertToQuestionFormat, searchQuery]);

  // Get total count for all question types
  const totalCounts = {
    mcqs: mcqsResponse?.pagination?.totalCount || 0,
    short: shortResponse?.pagination?.totalCount || 0,
    long: longResponse?.pagination?.totalCount || 0,
    total: (mcqsResponse?.pagination?.totalCount || 0) + 
           (shortResponse?.pagination?.totalCount || 0) + 
           (longResponse?.pagination?.totalCount || 0),
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Questions</CardTitle>
          <CardDescription>Loading questions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Questions</CardTitle>
          <CardDescription>Error loading questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.data?.message || error?.message || "Failed to load questions. Please try again."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (totalCounts.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Questions</CardTitle>
          <CardDescription>No questions have been saved yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">
            Generate some questions using the AI Question Generation feature above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Saved Questions ({totalCounts[selectedQuestionType as keyof typeof totalCounts] || 0})
        </CardTitle>
        <CardDescription>
          Total: {totalCounts.total} questions • MCQs: {totalCounts.mcqs} • Short: {totalCounts.short} • Long: {totalCounts.long}
          {currentResponse?.pagination && (
            <span className="ml-2">
              • Page {currentResponse.pagination.page} of {currentResponse.pagination.totalPages}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              value={selectedQuestionType}
              onValueChange={onQuestionTypeChange}
            >
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcqs">MCQs ({totalCounts.mcqs})</SelectItem>
                <SelectItem value="short">Short Questions ({totalCounts.short})</SelectItem>
                <SelectItem value="long">Long Questions ({totalCounts.long})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">
              {searchQuery
                ? `No questions found matching "${searchQuery}"`
                : `No ${selectedQuestionType} questions available`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={onUpdateQuestion}
                onDelete={onDeleteQuestion}
                qType={selectedQuestionType}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {currentResponse?.pagination && currentResponse.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-slate-600">
              Showing {((currentResponse.pagination.page - 1) * currentResponse.pagination.limit) + 1} to{" "}
              {Math.min(currentResponse.pagination.page * currentResponse.pagination.limit, currentResponse.pagination.totalCount)} of{" "}
              {currentResponse.pagination.totalCount} questions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!currentResponse.pagination.hasPreviousPage}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {currentResponse.pagination.page} of {currentResponse.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!currentResponse.pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Show count summary for search results */}
        {searchQuery && filteredQuestions.length > 0 && (
          <div className="text-sm text-slate-600 text-center pt-2">
            Found {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}
