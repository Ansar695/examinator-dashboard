"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Shuffle, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import { Badge } from "@/components/ui/badge";
import { QuestionItem } from "@/components/questions/QuestionItem";
import {
  useGetLongQuestionQuery,
  useGetMCQsQuestionQuery,
  useGetShortQuestionQuery,
} from "@/lib/api/saveQuestionsApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetPaperLongQsQuery, useGetPaperMCQsQuery, useGetPaperShortQsQuery } from "@/lib/api/paperGeneration";

interface McqProps {
  id: string;
  text: string;
  options: string[];
}

interface ShortProps {
  id: string;
  text: string;
}

interface LongProps {
  id: string;
  text: string;
}

type QuestionType = "mcq" | "short" | "long";

export default function SelectQuestions() {
  const [selectedQuestions, setSelectedQuestions] = useState<
    Record<QuestionType, string[]>
  >({
    mcq: [],
    short: [],
    long: [],
  });

  console.log("selectedQuestions =>>> ", selectedQuestions)

  const params = useParams();
  const router = useRouter();
  const board = params.board as string;
  const classNumber = params.class as string;
  const subject = params.subject as string;

  const [page, setPage] = useState(1);
  const [currentQuestionType, setCurrentQuestionType] =
    useState<QuestionType>("mcq");

  // Get chapter IDs from localStorage
  const chapterIds = JSON.parse(
    localStorage.getItem("selectedChapters") || "[]"
  );

  const {
    data: mcqsResponse,
    isLoading: mcqsLoading,
    error: mcqsError,
  } = useGetPaperMCQsQuery(
    {
      chapterIds: JSON.stringify(chapterIds),
      page: currentQuestionType === "mcq" ? page : 1,
      limit: 25,
    },
    {
      skip: chapterIds.length === 0,
    }
  );

  const {
    data: shortResponse,
    isLoading: shortLoading,
    error: shortError,
  } = useGetPaperShortQsQuery(
    {
      chapterIds: JSON.stringify(chapterIds),
      page: currentQuestionType === "short" ? page : 1,
      limit: 25,
    },
    {
      skip: chapterIds.length === 0,
    }
  );

  const {
    data: longResponse,
    isLoading: longLoading,
    error: longError,
  } = useGetPaperLongQsQuery(
    {
      chapterIds: JSON.stringify(chapterIds),
      page: currentQuestionType === "long" ? page : 1,
      limit: 25,
    },
    {
      skip: chapterIds.length === 0,
    }
  );

  // Memoized questions data
  const questions = useMemo(() => {
    return {
      mcq: mcqsResponse?.data || [],
      short: shortResponse?.data || [],
      long: longResponse?.data || [],
    };
  }, [mcqsResponse, shortResponse, longResponse]);

  // Check loading state
  const isLoading = useMemo(() => {
    switch (currentQuestionType) {
      case "mcq":
        return mcqsLoading;
      case "short":
        return shortLoading;
      case "long":
        return longLoading;
      default:
        return false;
    }
  }, [currentQuestionType, mcqsLoading, shortLoading, longLoading]);

  // Check error state
  const error = useMemo(() => {
    switch (currentQuestionType) {
      case "mcq":
        return mcqsError;
      case "short":
        return shortError;
      case "long":
        return longError;
      default:
        return null;
    }
  }, [currentQuestionType, mcqsError, shortError, longError]);

  // Handle question selection
  const handleQuestionSelect = (
    type: QuestionType,
    id: string,
    selected: boolean
  ) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [type]: selected
        ? [...prev[type], id]
        : prev[type].filter((qId) => qId !== id),
    }));
  };

  // Handle random selection
  const handleRandomSelection = (type: QuestionType) => {
    const allQuestions = questions[type];
    if (allQuestions.length === 0) return;

    const selectedCount = Math.min(3, allQuestions.length);
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, selectedCount).map((q: any) => q.id);

    setSelectedQuestions((prev) => ({
      ...prev,
      [type]: selected,
    }));
  };

  // Handle continue to preview
  const handleContinue = () => {
    if (getTotalSelectedQuestions() === 0) {
      alert("Please select at least one question!");
      return;
    }

    // Save selected questions to localStorage
    localStorage.setItem(
      "selectedQuestions",
      JSON.stringify(selectedQuestions)
    );

    router.push(`/${board}/${classNumber}/${subject}/view-paper`);
  };

  // Get total selected questions
  const getTotalSelectedQuestions = () => {
    return Object.values(selectedQuestions).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setCurrentQuestionType(value as QuestionType);
    setPage(1); // Reset page when changing tabs
  };

  // Redirect if no chapters selected
  useEffect(() => {
    if (chapterIds.length === 0) {
      router.push(`/${board}/${classNumber}/${subject}/select-topics`);
    }
  }, [chapterIds, router, board, classNumber, subject]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <Link href={`/${board}/${classNumber}/${subject}/select-topics`}>
              <Button
                variant="ghost"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topic Selection
              </Button>
            </Link>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Selected: {getTotalSelectedQuestions()}
            </Badge>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Select Questions for Your Paper
            </h1>
            <p className="text-xl text-gray-600">
              {board.replace("-", " ")} - Class {classNumber} - {subject}
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs
            defaultValue="mcq"
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mcq">MCQs</TabsTrigger>
              <TabsTrigger value="short">Short Questions</TabsTrigger>
              <TabsTrigger value="long">Long Questions</TabsTrigger>
            </TabsList>

            {(["mcq", "short", "long"] as const).map((type) => (
              <TabsContent key={type} value={type}>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {type === "mcq"
                      ? "Multiple Choice Questions"
                      : `${
                          type.charAt(0).toUpperCase() + type.slice(1)
                        } Questions`}
                  </h2>
                  <Button
                    onClick={() => handleRandomSelection(type)}
                    variant="outline"
                    className="flex items-center"
                    disabled={isLoading || questions[type].length === 0}
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
                {!isLoading && !error && questions[type].length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No questions available for the selected chapters.
                    </p>
                  </div>
                )}

                {/* Questions List */}
                {!isLoading && !error && questions[type].length > 0 && (
                  <div>
                    {questions[type].map((question: any) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        onSelect={(id, selected) =>
                          handleQuestionSelect(type, id, selected)
                        }
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={getTotalSelectedQuestions() === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview Paper
              <ArrowRight className="ml-2 h-5 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
