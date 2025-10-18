"use client";

import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import { QuestionSelectionTab } from "@/components/questions/QuestionSelectionTab";
import { QuestionSelectionHeader } from "@/components/questions/QuestionSelectionHeader";
import { useQuestionSelection } from "@/hooks/useQuestionSelection";

export default function SelectQuestions() {
  const params = useParams();
  const searchParams = useSearchParams();
  const board = params.board as string;
  const classNumber = params.class as string;
  const subject = params.subject as string;
  const subjectId = searchParams.get("subjectId");

  const {
    questions,
    isLoading,
    error,
    isCreatingPaper,
    currentQuestionType,
    handleQuestionSelect,
    handleRandomSelection,
    handleTabChange,
    handleContinue,
    getTotalSelectedQuestions,
  } = useQuestionSelection({
    board,
    classNumber,
    subject,
    subjectId,
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <QuestionSelectionHeader
            board={board}
            classNumber={classNumber}
            subject={subject}
            subjectId={subjectId}
            totalSelected={getTotalSelectedQuestions()}
          />

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
              <QuestionSelectionTab
                key={type}
                type={type}
                questions={questions[type]}
                isLoading={isLoading}
                error={error}
                onRandomSelect={() => handleRandomSelection(type)}
                onQuestionSelect={(id: string, selected: boolean) => 
                  handleQuestionSelect(type, id, selected)
                }
              />
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
              disabled={getTotalSelectedQuestions() === 0 || isCreatingPaper}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingPaper ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Paper...
                </>
              ) : (
                <>
                  Preview Paper
                  <ArrowRight className="ml-2 h-5 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
