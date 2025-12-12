import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useGetPaperByIdQuery, useUpdatePaperMutation } from '@/lib/api/paperGeneration';

interface Question {
  id: string;
  text: string;
  options?: string[];
  parts?: string[];
}

interface UsePaperManagementProps {
  paperId: string | null;
  board: string;
  classNumber: string;
  subject: string;
}

export const usePaperManagement = ({
  paperId,
  board,
  classNumber,
  subject,
}: UsePaperManagementProps) => {
  const router = useRouter();
  const { toast } = useToast();
  
  // State management
  const [questions, setQuestions] = useState<{
    mcq: Question[];
    short: Question[];
    long: Question[];
  }>({
    mcq: [],
    short: [],
    long: [],
  });
  
  const [mcqMarks, setMcqMarks] = useState<number | undefined>();
  const [marks, setMarks] = useState<Record<string, number | undefined>>({});
  const [examTime, setExamTime] = useState('3:00');
  const [paperName, setPaperName] = useState('Annual Examination');
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPaperData, setOriginalPaperData] = useState<any>(null);
  const [calculatedTotalMarks, setCalculatedTotalMarks] = useState(0);

  // Fetch paper data
  const { data: paperData, isLoading: isPaperLoading, error: paperError } = useGetPaperByIdQuery(paperId || '', {
    skip: !paperId,
  });

  // Update paper mutation
  const [updatePaper, { isLoading: isUpdating }] = useUpdatePaperMutation();

  // Get paper data sections
  const paperMcqs = paperData?.data?.mcqs || [];
  const paperShorts = paperData?.data?.shortQs || [];
  const paperLongs = paperData?.data?.longQs || [];

  // Process questions from paper data
  useEffect(() => {
    if (paperData?.data) {
      // For MCQs, use data directly from paper including options
      const mcqsWithOptions = paperMcqs.map(paperMcq => ({
        id: paperMcq.questionId,
        text: paperMcq.question,
        options: paperMcq.options || [],
      }));

      // For short questions, use data directly from paper
      const shortQuestions = paperShorts.map(q => ({
        id: q.questionId,
        text: q.question,
      }));

      // For long questions, use data directly from paper including parts
      const longQuestions = paperLongs.map(q => ({
        id: q.questionId,
        text: q.question,
        parts: q.parts?.map(p => `${p.partLabel}) ${p.question}`) || [],
      }));

      setQuestions({
        mcq: mcqsWithOptions,
        short: shortQuestions,
        long: longQuestions,
      });

      // Set initial marks
      const mcqTotalMarks = paperMcqs.reduce((sum, q) => sum + q.marks, 0);
      setMcqMarks(mcqTotalMarks);
      
      // Set individual marks for short and long questions
      paperShorts.forEach(q => {
        setMarks(prev => ({ ...prev, [q.questionId]: q.marks }));
      });
      
      paperLongs.forEach(q => {
        if (q.totalMarks) {
          setMarks(prev => ({ ...prev, [q.questionId]: q.totalMarks }));
        }
        q.parts?.forEach((part, idx) => {
          setMarks(prev => ({ ...prev, [`${q.questionId}-${idx}`]: part.marks }));
        });
      });

      // Calculate total marks
      const shortTotalMarks = paperShorts.reduce((sum, q) => sum + q.marks, 0);
      const longTotalMarks = paperLongs.reduce((sum, q) => sum + (q.totalMarks || 0), 0);
      setCalculatedTotalMarks(mcqTotalMarks + shortTotalMarks + longTotalMarks);

      // Store original data for comparison
      setOriginalPaperData(paperData.data);
      setIsLoadingQuestions(false);
    }
  }, [paperData, paperMcqs, paperShorts, paperLongs]);

  // Update paper name and exam time when data is loaded
  useEffect(() => {
    if (paperData?.data) {
      if (paperData.data.title) {
        setPaperName(paperData.data.title);
      }
      if (paperData.data.examTime) {
        setExamTime(paperData.data.examTime);
      }
    }
  }, [paperData]);

  // Track changes - compare with original data
  useEffect(() => {
    if (!originalPaperData) {
      setHasChanges(false);
      return;
    }

    // Check if paper name or exam time changed
    const nameChanged = paperName !== originalPaperData.title;
    const timeChanged = examTime !== (originalPaperData.examTime || '3:00');
    console.log("questions changes =>>> ", questions)
    // Check if any question text changed
    const questionsChanged = 
      questions.mcq.some(q => {
        const original = paperMcqs.find(m => m.questionId === q.id);
        return original && (q.text !== original.question || 
          JSON.stringify(q.options) !== JSON.stringify(original.options));
      }) ||
      questions.short.some(q => {
        const original = paperShorts.find(s => s.questionId === q.id);
        return original && q.text !== original.question;
      }) ||
      questions.long.some(q => {
        const original = paperLongs.find(l => l.questionId === q.id);
        return original && q.text !== original.question;
      });

    // Check if marks changed
    const marksChanged = 
      mcqMarks !== paperMcqs.reduce((sum, q) => sum + q.marks, 0) ||
      Object.entries(marks).some(([id, value]) => {
        if (id.includes('-')) {
          // Part marks
          const [questionId, partIdx] = id.split('-');
          const longQ = paperLongs.find(l => l.questionId === questionId);
          return longQ?.parts?.[parseInt(partIdx)]?.marks !== value;
        } else {
          // Question marks
          const shortQ = paperShorts.find(s => s.questionId === id);
          const longQ = paperLongs.find(l => l.questionId === id);
          return (shortQ && shortQ.marks !== value) || (longQ && longQ.totalMarks !== value);
        }
      });

    setHasChanges(nameChanged || timeChanged || questionsChanged || marksChanged);
  }, [paperName, examTime, questions, marks, mcqMarks, originalPaperData, paperMcqs, paperShorts, paperLongs]);

  // Handle question edit
  const handleQuestionEdit = (type: 'mcq' | 'short' | 'long', id: string, newText: string) => {
    console.log("Editing question:", type, id, newText);
    setQuestions(prev => ({
      ...prev,
      [type]: prev[type].map(q => q.id === id ? { ...q, text: newText } : q)
    }));
  };

  // Handle MCQ option edit
  const handleMCQOptionEdit = (questionId: string, optionIndex: number, newText: string) => {
    setQuestions(prev => ({
      ...prev,
      mcq: prev.mcq.map(q => 
        q.id === questionId && q.options
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? newText : opt) }
          : q
      )
    }));
  };

  // Handle marks change
  const handleMarksChange = (id: string, value: string) => {
    setMarks(prev => ({
      ...prev,
      [id]: value === '' ? undefined : Number(value)
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!paperId || !originalPaperData) return;

    try {
      // Prepare updated data
      const updatedMcqs = questions.mcq.map(q => {
        const originalMcq = paperMcqs.find(m => m.questionId === q.id);
        return {
          questionId: q.id,
          question: q.text,
          options: q.options || [],
          correctAnswer: originalMcq?.correctAnswer,
          marks: mcqMarks ? Math.floor(mcqMarks / questions.mcq.length) : 1,
        };
      });

      const updatedShorts = questions.short.map(q => {
        const originalShort = paperShorts.find(s => s.questionId === q.id);
        return {
          questionId: q.id,
          question: q.text,
          answer: originalShort?.answer,
          marks: marks[q.id] || 5,
        };
      });

      const updatedLongs = questions.long.map(q => {
        const originalLong = paperLongs.find(l => l.questionId === q.id);
        const updatedParts = originalLong?.parts?.map((part, idx) => ({
          ...part,
          marks: marks[`${q.id}-${idx}`] || part.marks,
        })) || [];

        return {
          questionId: q.id,
          question: q.text,
          answer: originalLong?.answer,
          totalMarks: marks[q.id] || 10,
          parts: updatedParts,
        };
      });

      // Calculate new total marks
      const newTotalMarks = 
        (mcqMarks || 0) + 
        updatedShorts.reduce((sum, q) => sum + (q.marks || 0), 0) +
        updatedLongs.reduce((sum, q) => sum + (q.totalMarks || 0), 0);

      const response = await updatePaper({
        id: paperId,
        data: {
          title: paperName,
          examTime: examTime,
          totalMarks: newTotalMarks,
          mcqs: updatedMcqs,
          shortQs: updatedShorts,
          longQs: updatedLongs,
        }
      }).unwrap();

      if (response.success) {
        toast({
          title: "Paper updated successfully",
          description: "Your changes have been saved.",
        });
        setHasChanges(false);
        setOriginalPaperData(response.data);
      }
    } catch (error) {
      console.error('Error updating paper:', error);
      toast({
        title: "Error updating paper",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle edit navigation
  const handleEdit = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const subjectId = searchParams.get('subjectId');
    router.push(`/${board}/${classNumber}/${subject}/select-questions?subjectId=${subjectId}&paperId=${paperId}`);
  };

  return {
    // State
    questions,
    mcqMarks,
    marks,
    examTime,
    paperName,
    isLoadingQuestions,
    hasChanges,
    calculatedTotalMarks,
    
    // Paper data
    paperData,
    isPaperLoading,
    paperError,
    isUpdating,
    
    // Handlers
    handleQuestionEdit,
    handleMCQOptionEdit,
    handleMarksChange,
    handleSaveChanges,
    handleEdit,
    setExamTime,
    setPaperName,
    setMcqMarks,
  };
};