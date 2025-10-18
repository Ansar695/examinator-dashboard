import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  useGetPaperLongQsQuery,
  useGetPaperMCQsQuery,
  useGetPaperShortQsQuery,
  useCreatePaperMutation,
} from '@/lib/api/paperGeneration';

type QuestionType = 'mcq' | 'short' | 'long';

interface UseQuestionSelectionProps {
  board: string;
  classNumber: string;
  subject: string;
  subjectId: string | null;
}

export const useQuestionSelection = ({
  board,
  classNumber,
  subject,
  subjectId,
}: UseQuestionSelectionProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [currentQuestionType, setCurrentQuestionType] = useState<QuestionType>('mcq');
  const [selectedQuestions, setSelectedQuestions] = useState<Record<QuestionType, string[]>>({
    mcq: [],
    short: [],
    long: [],
  });

  // Get chapter IDs from localStorage
  const chapterIds = JSON.parse(localStorage.getItem('selectedChapters') || '[]');

  // Fetch questions
  const {
    data: mcqsResponse,
    isLoading: mcqsLoading,
    error: mcqsError,
  } = useGetPaperMCQsQuery(
    {
      chapterIds: JSON.stringify(chapterIds),
      page: currentQuestionType === 'mcq' ? page : 1,
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
      page: currentQuestionType === 'short' ? page : 1,
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
      page: currentQuestionType === 'long' ? page : 1,
      limit: 25,
    },
    {
      skip: chapterIds.length === 0,
    }
  );

  // Create paper mutation
  const [createPaper, { isLoading: isCreatingPaper }] = useCreatePaperMutation();

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
      case 'mcq':
        return mcqsLoading;
      case 'short':
        return shortLoading;
      case 'long':
        return longLoading;
      default:
        return false;
    }
  }, [currentQuestionType, mcqsLoading, shortLoading, longLoading]);

  // Check error state
  const error = useMemo(() => {
    switch (currentQuestionType) {
      case 'mcq':
        return mcqsError;
      case 'short':
        return shortError;
      case 'long':
        return longError;
      default:
        return null;
    }
  }, [currentQuestionType, mcqsError, shortError, longError]);

  // Handle question selection
  const handleQuestionSelect = (type: QuestionType, id: string, selected: boolean) => {
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
    setPage(1); // Reset page when changing tabs
  };

  // Handle continue to preview
  const handleContinue = async () => {
    if (getTotalSelectedQuestions() === 0) {
      toast({
        title: 'No questions selected',
        description: 'Please select at least one question!',
        variant: 'destructive',
      });
      return;
    }

    if (!subjectId) {
      toast({
        title: 'Subject not found',
        description: 'Please go back and select a subject again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Get selected questions with their details
      const selectedMcqDetails = questions.mcq.filter(q => selectedQuestions.mcq.includes(q.id));
      const selectedShortDetails = questions.short.filter(q => selectedQuestions.short.includes(q.id));
      const selectedLongDetails = questions.long.filter(q => selectedQuestions.long.includes(q.id));

      // Prepare MCQs payload
      const mcqsPayload = selectedMcqDetails.map(q => ({
        questionId: q.id,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        marks: 1, // 1 mark per MCQ
      }));

      // Prepare short questions payload
      const shortQsPayload = selectedShortDetails.map(q => ({
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        marks: 5, // 5 marks per short question
      }));

      // Prepare long questions payload
      const longQsPayload = selectedLongDetails.map(q => ({
        questionId: q.id,
        question: q.question,
        answer: q.answer,
        totalMarks: 10, // 10 marks per long question
        parts: [], // You can add logic to split questions into parts if needed
      }));

      // Calculate total marks
      const mcqMarks = mcqsPayload.reduce((sum, q) => sum + q.marks, 0);
      const shortMarks = shortQsPayload.reduce((sum, q) => sum + q.marks, 0);
      const longMarks = longQsPayload.reduce((sum, q) => sum + (q.totalMarks || 0), 0);
      const totalMarks = mcqMarks + shortMarks + longMarks;

      // Create paper title
      const paperTitle = `${subject} Annual Exam ${new Date().getFullYear()}`;

      // Call the API to create the paper
      const response = await createPaper({
        title: paperTitle,
        subjectId,
        totalMarks,
        mcqs: mcqsPayload,
        shortQs: shortQsPayload,
        longQs: longQsPayload,
      }).unwrap();

      if (response.success && response.data) {
        // Save the generated paper ID and selected questions to localStorage
        localStorage.setItem('generatedPaperId', response.data.id);
        localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));

        toast({
          title: 'Paper created successfully',
          description: 'Redirecting to paper preview...',
        });

        // Navigate to the view paper page
        router.push(`/${board}/${classNumber}/${subject}/view-paper?paperId=${response.data.id}&subjectId=${subjectId}`);
      }
    } catch (error) {
      console.error('Error creating paper:', error);
      toast({
        title: 'Error creating paper',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Redirect if no chapters selected
  useEffect(() => {
    if (chapterIds.length === 0) {
      router.push(`/${board}/${classNumber}/${subject}/select-topics${subjectId ? `?subjectId=${subjectId}` : ''}`);
    }
  }, [chapterIds, router, board, classNumber, subject, subjectId]);

  return {
    selectedQuestions,
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
  };
};