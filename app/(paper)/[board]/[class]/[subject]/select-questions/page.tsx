"use client";

import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Loader2, X } from "lucide-react";
import { PageTransition } from "@/components/shared/Transition";
import { QuestionSelectionTab } from "@/components/questions/QuestionSelectionTab";
import { QuestionSelectionHeader } from "@/components/questions/QuestionSelectionHeader";
import { useQuestionSelection } from "@/hooks/useQuestionSelection";
import { QuestionSearch } from "@/components/questions/QuestionSearch";

export default function SelectQuestions() {
  const params = useParams();
  const searchParams = useSearchParams();
  const board = params.board as string;
  const classNumber = params.class as string;
  const subject = params.subject as string;
  const subjectId = searchParams.get("subjectId");
  const paperId = searchParams.get("paperId");

  const {
    questions,
    selectedQuestions,
    isLoading,
    error,
    isCreatingPaper,
    currentQuestionType,
    pages,
    searchTerms,
    handleQuestionSelect,
    handleRandomSelection,
    handleTabChange,
    handleContinue,
    handlePageChange,
    handleSearchChange,
    getTotalSelectedQuestions,
    getPaginationInfo,
    isEditMode,
  } = useQuestionSelection({
    board,
    classNumber,
    subject,
    subjectId,
    paperId,
  });

  const allSelectedQuestions = [
    ...(selectedQuestions.mcq || []),
    ...(selectedQuestions.short || []),
    ...(selectedQuestions.long || []),
  ];

  const getSelectedQuestionData = (id: string) => {
    for (const type of ["mcq", "short", "long"] as const) {
      const q = questions[type]?.find((q: any) => q.id === id);
      if (q) return { ...q, type };
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 p-2 md:p-6">
        <div className="max-w-[1380px] mx-auto bg-white rounded-md p-3 md:p-5">
          {/* Compact Header */}
          <QuestionSelectionHeader
            board={board}
            classNumber={classNumber}
            subject={subject}
            subjectId={subjectId}
            totalSelected={getTotalSelectedQuestions()}
            isEditMode={isEditMode}
            paperId={paperId}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isEditMode ? "Edit Paper Questions" : "Select Questions"}
                </h1>
                <p className="text-sm text-gray-600 mt-1 capitalize">
                  {board.replace("-", " ")} • Class {classNumber} • {subject}
                </p>
              </motion.div>

              {/* Tabs - Modern Design */}
              <Tabs
                defaultValue="mcq"
                onValueChange={handleTabChange}
                className="w-full"
              >
                <div className="flex lg:flex-row flex-col gap-8 items-center justify-between">
                  {/* Search Bar */}
                  <QuestionSearch
                    value={searchTerms[currentQuestionType]}
                    onChange={(value) =>
                      handleSearchChange(currentQuestionType, value)
                    }
                    placeholder={`Search ${
                      currentQuestionType === "mcq"
                        ? "MCQs"
                        : currentQuestionType
                    } questions...`}
                  />

                  <TabsList className="grid w-[50%] md:w-110 grid-cols-3 h-11 bg-gray-100 p-1 rounded-lg mb-6">
                    <TabsTrigger
                      value="mcq"
                      className="cursor-pointer text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      MCQs
                    </TabsTrigger>
                    <TabsTrigger
                      value="short"
                      className="cursor-pointer text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Short
                    </TabsTrigger>
                    <TabsTrigger
                      value="long"
                      className="cursor-pointer text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      Long
                    </TabsTrigger>
                  </TabsList>
                </div>

                {(["mcq", "short", "long"] as const).map((type) => {
                  const paginationInfo = getPaginationInfo(type);
                  return (
                    <QuestionSelectionTab
                      key={type}
                      type={type}
                      questions={questions[type]}
                      selectedQuestions={selectedQuestions[type]}
                      isLoading={isLoading}
                      error={error}
                      onRandomSelect={() => handleRandomSelection(type)}
                      onQuestionSelect={(id: string, selected: boolean) =>
                        handleQuestionSelect(type, id, selected)
                      }
                      searchTerm={searchTerms[type]}
                      onSearchChange={(value) =>
                        handleSearchChange(type, value)
                      }
                      currentPage={pages[type]}
                      totalPages={paginationInfo.totalPages}
                      onPageChange={(page) => handlePageChange(type, page)}
                    />
                  );
                })}
              </Tabs>
            </div>

            {/* Right Sidebar - Selected Questions Review */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-6 bg-gray-100 rounded-xl border border-blue-200 p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Selected ({getTotalSelectedQuestions()})
                </h3>

                {getTotalSelectedQuestions() === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No questions selected yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allSelectedQuestions.map((id) => {
                      const qData = getSelectedQuestionData(id);
                      if (!qData) return null;

                      const typeLabel = {
                        mcq: "📋",
                        short: "✏️",
                        long: "📄",
                      }[qData.type];

                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white rounded-lg p-3 flex items-start justify-between group hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              {typeLabel} {qData.type.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-2">
                              {qData.question || "Question"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleQuestionSelect(qData.type, id, false)
                            }
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            aria-label="Remove question"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Continue Button - Sticky */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  onClick={handleContinue}
                  disabled={
                    getTotalSelectedQuestions() === 0 || isCreatingPaper
                  }
                  className="cursor-pointer w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isCreatingPaper ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditMode ? "Update Paper" : "Preview Paper"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
