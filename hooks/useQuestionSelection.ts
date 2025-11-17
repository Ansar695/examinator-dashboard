import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPaperLongQsQuery,
  useGetPaperMCQsQuery,
  useGetPaperShortQsQuery,
  useCreatePaperMutation,
  useUpdatePaperMutation,
  useGetPaperByIdQuery,
} from "@/lib/api/paperGeneration";

type QuestionType = "mcq" | "short" | "long";

interface UseQuestionSelectionProps {
  board: string;
  classNumber: string;
  subject: string;
  subjectId: string | null;
  paperId?: string | null;
}

export const useQuestionSelection = ({
  board,
  classNumber,
  subject,
  subjectId,
  paperId,
}: UseQuestionSelectionProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestionType, setCurrentQuestionType] =
    useState<QuestionType>("mcq");
  const [selectedQuestions, setSelectedQuestions] = useState<
    Record<QuestionType, string[]>
  >({
    mcq: [],
    short: [],
    long: [],
  });

  // Separate pagination for each question type
  const [pages, setPages] = useState<Record<QuestionType, number>>({
    mcq: 1,
    short: 1,
    long: 1,
  });

  // Search terms for each question type
  const [searchTerms, setSearchTerms] = useState<Record<QuestionType, string>>({
    mcq: "",
    short: "",
    long: "",
  });

  // Get chapter IDs from localStorage
  const chapterIds = JSON.parse(
    localStorage.getItem("selectedChapters") || "[]"
  );

  // Fetch questions with pagination and search
  const {
    data: mcqsResponse,
    isLoading: mcqsLoading,
    error: mcqsError,
  } = useGetPaperMCQsQuery(
    {
      chapterIds: JSON.stringify(chapterIds),
      page: pages.mcq,
      limit: 10,
      search: searchTerms.mcq,
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
      page: pages.short,
      limit: 10,
      search: searchTerms.short,
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
      page: pages.long,
      limit: 10,
      search: searchTerms.long,
    },
    {
      skip: chapterIds.length === 0,
    }
  );

  // Create paper mutation
  const [createPaper, { isLoading: isCreatingPaper }] =
    useCreatePaperMutation();
  const [updatePaper, { isLoading: isUpdatingPaper }] =
    useUpdatePaperMutation();

  // Fetch existing paper data if editing
  const { data: existingPaperData } = useGetPaperByIdQuery(paperId || "", {
    skip: !paperId,
  });

  // Load existing paper selections when editing
  useEffect(() => {
    if (existingPaperData?.data && paperId) {
      const paper = existingPaperData.data;

      // Extract question IDs from the paper
      const mcqIds = paper.mcqs.map((q) => q.questionId);
      const shortIds = paper.shortQs.map((q) => q.questionId);
      const longIds = paper.longQs.map((q) => q.questionId);

      setSelectedQuestions({
        mcq: mcqIds,
        short: shortIds,
        long: longIds,
      });

      // Also need to set the chapters in localStorage for the queries to work
      // Extract unique chapter IDs from all questions
      const allQuestionIds = [...mcqIds, ...shortIds, ...longIds];
      // Note: We might need to fetch the questions to get their chapter IDs
      // For now, we'll assume the chapters are already set from the previous flow
    }
  }, [existingPaperData, paperId]);

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
  };

  // Handle page change for specific question type
  const handlePageChange = (type: QuestionType, newPage: number) => {
    setPages((prev) => ({ ...prev, [type]: newPage }));
  };

  // Handle search change for specific question type
  const handleSearchChange = (type: QuestionType, searchTerm: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: searchTerm }));
    setPages((prev) => ({ ...prev, [type]: 1 })); // Reset to first page on search
  };

  // Get pagination info for current question type
  const getPaginationInfo = (type: QuestionType) => {
    switch (type) {
      case "mcq":
        return mcqsResponse?.pagination || { totalPages: 1, currentPage: 1 };
      case "short":
        return shortResponse?.pagination || { totalPages: 1, currentPage: 1 };
      case "long":
        return longResponse?.pagination || { totalPages: 1, currentPage: 1 };
      default:
        return { totalPages: 1, currentPage: 1 };
    }
  };

  // Handle continue to preview
  const handleContinue = async () => {
    if (getTotalSelectedQuestions() === 0) {
      toast({
        title: "No questions selected",
        description: "Please select at least one question!",
        variant: "destructive",
      });
      return;
    }

    if (!subjectId) {
      toast({
        title: "Subject not found",
        description: "Please go back and select a subject again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get selected questions with their details
      const selectedMcqDetails = questions.mcq.filter((q) =>
        selectedQuestions.mcq.includes(q.id)
      );
      const selectedShortDetails = questions.short.filter((q) =>
        selectedQuestions.short.includes(q.id)
      );
      const selectedLongDetails = questions.long.filter((q) =>
        selectedQuestions.long.includes(q.id)
      );

      // Prepare MCQs payload
      const mcqsPayload = selectedMcqDetails.map((q) => ({
        questionId: q.id,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        marks: 1, // 1 mark per MCQ
      }));

      // Prepare short questions payload
      const shortQsPayload = selectedShortDetails.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        marks: 5, // 5 marks per short question
      }));

      // Prepare long questions payload
      const longQsPayload = selectedLongDetails.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        totalMarks: 10, // 10 marks per long question
        parts: [], // You can add logic to split questions into parts if needed
      }));

      // Calculate total marks
      const mcqMarks = mcqsPayload.reduce((sum, q) => sum + q.marks, 0);
      const shortMarks = shortQsPayload.reduce((sum, q) => sum + q.marks, 0);
      const longMarks = longQsPayload.reduce(
        (sum, q) => sum + (q.totalMarks || 0),
        0
      );
      const totalMarks = mcqMarks + shortMarks + longMarks;

      // Create paper title
      const paperTitle =
        paperId && existingPaperData?.data?.title
          ? existingPaperData.data.title
          : `${subject} Annual Exam ${new Date().getFullYear()}`;

      // Call the API to create or update the paper
      if (paperId) {
        // Update existing paper
        const response = await updatePaper({
          id: paperId,
          data: {
            title: paperTitle,
            subjectId,
            totalMarks,
            mcqs: mcqsPayload,
            shortQs: shortQsPayload,
            longQs: longQsPayload,
          },
        }).unwrap();

        if (response.success && response.data) {
          toast({
            title: "Paper updated successfully",
            description: "Redirecting to paper preview...",
          });

          // Navigate to the view paper page
          router.push(
            `/${board}/${classNumber}/${subject}/view-paper?paperId=${paperId}&subjectId=${subjectId}`
          );
        }
      } else {
        // Create new paper
        const response = await createPaper({
          title: paperTitle,
          subjectId,
          totalMarks,
          mcqs: mcqsPayload,
          shortQs: shortQsPayload,
          longQs: longQsPayload,
        }).unwrap();

        console.log("response =>>> ", response);

        if (response.success && response.data) {
          // Save the generated paper ID and selected questions to localStorage
          localStorage.setItem("generatedPaperId", response.data.id);
          localStorage.setItem(
            "selectedQuestions",
            JSON.stringify(selectedQuestions)
          );

          toast({
            title: "Paper created successfully",
            description: "Redirecting to paper preview...",
          });

          // Navigate to the view paper page
          router.push(
            `/${board}/${classNumber}/${subject}/view-paper?paperId=${response.data.id}&subjectId=${subjectId}`
          );
        }
      }
    } catch (error: any) {
      console.log("Error creating paper:", error);
      if (error?.status === 402) {
        toast({
          title: "Error creating paper",
          description:
            error?.data?.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/plans");
        }, 4000);
      }else{
        toast({
          title: "Error creating paper",
          description:
            error?.data?.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Redirect if no chapters selected
  useEffect(() => {
    if (chapterIds.length === 0) {
      router.push(
        `/${board}/${classNumber}/${subject}/select-topics${
          subjectId ? `?subjectId=${subjectId}` : ""
        }`
      );
    }
  }, [chapterIds, router, board, classNumber, subject, subjectId]);

  return {
    selectedQuestions,
    questions,
    isLoading,
    error,
    isCreatingPaper: isCreatingPaper || isUpdatingPaper,
    isEditMode: !!paperId,
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
  };
};
