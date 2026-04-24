"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Save, X } from "lucide-react";

const SelectedQuestions = ({
  getTotalSelectedQuestions,
  getSelectedQuestionData,
  allSelectedQuestions,
  handleQuestionSelect,
  handleContinue,
  handleSaveDraft,
  isSavingDraft,
  isCreatingPaper,
  isEditMode,
}: any) => {
  return (
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
            <p className="text-gray-500 text-sm">No questions selected yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allSelectedQuestions.map((id: any) => {
              const qData: any = getSelectedQuestionData(id);
              if (!qData) return null;

              const allTypeLabel: any = {
                mcq: "📋",
                short: "✏️",
                long: "📄",
              };

              const typeLabel = allTypeLabel[qData?.type] || "❓";

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
                    onClick={() => handleQuestionSelect(qData.type, id, false)}
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
          disabled={getTotalSelectedQuestions() === 0 || isCreatingPaper}
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

        {handleSaveDraft ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            onClick={handleSaveDraft}
            disabled={getTotalSelectedQuestions() === 0 || isSavingDraft}
            className="cursor-pointer w-full mt-3 bg-white border border-slate-200 hover:border-slate-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-slate-700 font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Draft...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </motion.button>
        ) : null}
      </div>
    </motion.div>
  );
};

export default SelectedQuestions;
