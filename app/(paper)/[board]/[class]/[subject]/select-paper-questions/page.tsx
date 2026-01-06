"use client";

import { motion } from "framer-motion";
import { useParams, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/shared/Transition";
import { QuestionSelectionTab } from "@/components/questions/QuestionSelectionTab";
import { QuestionSelectionHeader } from "@/components/questions/QuestionSelectionHeader";
import { useQuestionSelection } from "@/hooks/useQuestionSelection";
import { QuestionSearch } from "@/components/questions/QuestionSearch";
import SelectedQuestions from "@/components/questions/SelectedQuestions";
import { boardNameFromSlug, classNameFromSlug, subjectNameFromSlug } from "@/utils/slugHanler";
import { questionTypeTabs } from "@/utils/static/questionTabs";
import { useState } from "react";
import { QuestionType } from "@/utils/types/questions.type";

const SelectPaperQuestions = () => {
    const params = useParams();
    const searchParams = useSearchParams()
    const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>('mcq');

    const isEditMode = false
    const boardSlug = params.board as any;
    const classSlug = params.class as string;
    const subjectSlug = params.subject as string;
    const paperId = searchParams.get("paperId");

    const boardName = boardNameFromSlug(boardSlug);
    const className = classNameFromSlug(classSlug);
    const subjectName = subjectNameFromSlug(subjectSlug);

    const handleTabChange = (value: string) => {
        setCurrentQuestionType(value as QuestionType);
    };


  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 p-2 md:p-6">
        <div className="max-w-[1380px] mx-auto bg-white rounded-md p-3 md:p-5">
          {/* Compact Header */}
          <QuestionSelectionHeader
            board={boardSlug}
            classNumber={classSlug}
            subject={subjectSlug}
            totalSelected={0}
            // totalSelected={getTotalSelectedQuestions()}
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
                  {boardName} • {className} • {subjectName}
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
                    {questionTypeTabs?.map((tab) => (
                    <TabsTrigger
                      key={tab?.value}
                      value={tab?.value}
                      className="cursor-pointer text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      {tab?.label}
                    </TabsTrigger>
                    ))}
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
                      onQuestionSelect={(question: any, selected: boolean) =>
                        handleQuestionSelect(type, question, selected)
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
  )
}

export default SelectPaperQuestions
