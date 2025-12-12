"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/Transition";
import { QuestionSelectionTab } from "@/components/questions/QuestionSelectionTab";
import { QuestionSelectionHeader } from "@/components/questions/QuestionSelectionHeader";
import { useQuestionSelection } from "@/hooks/useQuestionSelection";
import { QuestionSearch } from "@/components/questions/QuestionSearch";
import SelectedQuestions from "@/components/questions/SelectedQuestions";

export default function SelectQuestions() {
  const params = useParams();

  const boardSlug = params.board as any;
  const classSlug = params.class as string;
  const subjectSlug = params.subject as string;

  const boardName = boardSlug ? boardSlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
  const className = classSlug ? classSlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";
  const subjectName = subjectSlug ? subjectSlug.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "";

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
    boardSlug,
    classSlug,
    subjectSlug,
    paperId: null,
    subjectName,
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
            <SelectedQuestions 
              getTotalSelectedQuestions={getTotalSelectedQuestions}
              getSelectedQuestionData={getSelectedQuestionData}
              allSelectedQuestions={allSelectedQuestions}
              handleQuestionSelect={handleQuestionSelect}
              handleContinue={handleContinue}
              isCreatingPaper={isCreatingPaper}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
