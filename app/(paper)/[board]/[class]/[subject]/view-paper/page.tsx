'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Printer, Edit, Loader2, Save } from 'lucide-react'
import { PageTransition } from '@/components/shared/Transition'
import { PaperTemplateSelector } from '@/components/questions/PaperTemplates'
import { LanguageSelector } from '@/components/questions/LanguageSelector'
import { EditableQuestion } from '@/components/questions/EditableQuestion'
import { EditableMcq } from '@/components/questions/EditableMcq'
import { useGetPaperByIdQuery, useUpdatePaperMutation } from '@/lib/api/paperGeneration'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface Question {
  id: string;
  text: string;
  options?: string[];
  parts?: string[];
}

export default function PreviewPaper() {
  const [questions, setQuestions] = useState<{
    mcq: Question[];
    short: Question[];
    long: Question[];
  }>({
    mcq: [],
    short: [],
    long: [],
  })
  const [mcqMarks, setMcqMarks] = useState<number | undefined>()
  const [marks, setMarks] = useState<Record<string, number | undefined>>({})
  const [selectedTemplateId, setSelectedTemplateId] = useState('punjab-board-standard')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [examTime, setExamTime] = useState('2:30')
  const [paperName, setPaperName] = useState('Annual Examination')
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalPaperData, setOriginalPaperData] = useState<any>(null)
  
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const board = params.board as string
  const classNumber = params.class as string
  const subject = params.subject as string
  const paperId = searchParams.get('paperId')

  // Fetch paper data
  const { data: paperData, isLoading: isPaperLoading, error: paperError } = useGetPaperByIdQuery(paperId || '', {
    skip: !paperId,
  })

  // Update paper mutation
  const [updatePaper, { isLoading: isUpdating }] = useUpdatePaperMutation()

  // Get selected questions from the paper - they are already in the correct format
  const paperMcqs = paperData?.data?.mcqs || []
  const paperShorts = paperData?.data?.shortQs || []
  const paperLongs = paperData?.data?.longQs || []

  // Process questions from paper data
  useEffect(() => {
    if (paperData?.data) {
      // For MCQs, use data directly from paper including options
      const mcqsWithOptions = paperMcqs.map(paperMcq => ({
        id: paperMcq.questionId,
        text: paperMcq.question,
        options: paperMcq.options || [],
      }))

      // For short questions, use data directly from paper
      const shortQuestions = paperShorts.map(q => ({
        id: q.questionId,
        text: q.question,
      }))

      // For long questions, use data directly from paper including parts
      const longQuestions = paperLongs.map(q => ({
        id: q.questionId,
        text: q.question,
        parts: q.parts?.map(p => `${p.partLabel}) ${p.question}`) || [],
      }))

      setQuestions({
        mcq: mcqsWithOptions,
        short: shortQuestions,
        long: longQuestions,
      })

      // Set initial marks
      if (paperData.data.totalMarks) {
        const mcqTotalMarks = paperMcqs.reduce((sum, q) => sum + q.marks, 0)
        setMcqMarks(mcqTotalMarks)
        
        // Set individual marks for short and long questions
        paperShorts.forEach(q => {
          setMarks(prev => ({ ...prev, [q.questionId]: q.marks }))
        })
        
        paperLongs.forEach(q => {
          if (q.totalMarks) {
            setMarks(prev => ({ ...prev, [q.questionId]: q.totalMarks }))
          }
          q.parts?.forEach((part, idx) => {
            setMarks(prev => ({ ...prev, [`${q.questionId}-${idx}`]: part.marks }))
          })
        })
      }

      // Store original data for comparison
      setOriginalPaperData(paperData.data)
      setIsLoadingQuestions(false)
    }
  }, [paperData, paperMcqs, paperShorts, paperLongs])

  // Update paper name when data is loaded
  useEffect(() => {
    if (paperData?.data?.title) {
      setPaperName(paperData.data.title)
    }
  }, [paperData])

  // Track changes - compare with original data
  useEffect(() => {
    if (!originalPaperData) {
      setHasChanges(false)
      return
    }

    // Check if paper name changed
    const nameChanged = paperName !== originalPaperData.title

    // Check if any question text changed
    const questionsChanged =
      questions.mcq.some(q => {
        const original = paperMcqs.find(m => m.questionId === q.id)
        return original && (q.text !== original.question ||
          JSON.stringify(q.options) !== JSON.stringify(original.options))
      }) ||
      questions.short.some(q => {
        const original = paperShorts.find(s => s.questionId === q.id)
        return original && q.text !== original.question
      }) ||
      questions.long.some(q => {
        const original = paperLongs.find(l => l.questionId === q.id)
        return original && q.text !== original.question
      })

    // Check if marks changed
    const marksChanged =
      mcqMarks !== paperMcqs.reduce((sum, q) => sum + q.marks, 0) ||
      Object.entries(marks).some(([id, value]) => {
        if (id.includes('-')) {
          // Part marks
          const [questionId, partIdx] = id.split('-')
          const longQ = paperLongs.find(l => l.questionId === questionId)
          return longQ?.parts?.[parseInt(partIdx)]?.marks !== value
        } else {
          // Question marks
          const shortQ = paperShorts.find(s => s.questionId === id)
          const longQ = paperLongs.find(l => l.questionId === id)
          return (shortQ && shortQ.marks !== value) || (longQ && longQ.totalMarks !== value)
        }
      })

    setHasChanges(nameChanged || questionsChanged || marksChanged)
  }, [paperName, examTime, questions, marks, mcqMarks, originalPaperData, paperMcqs, paperShorts, paperLongs])

  const handleQuestionEdit = (type: 'mcq' | 'short' | 'long', id: string, newText: string) => {
    setQuestions(prev => ({
      ...prev,
      [type]: prev[type].map(q => q.id === id ? { ...q, text: newText } : q)
    }))
  }

  const handleMCQOptionEdit = (questionId: string, optionIndex: number, newText: string) => {
    setQuestions(prev => ({
      ...prev,
      mcq: prev.mcq.map(q =>
        q.id === questionId && q.options
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? newText : opt) }
          : q
      )
    }))
  }

  const handleMarksChange = (id: string, value: string) => {
    setMarks(prev => ({
      ...prev,
      [id]: value === '' ? undefined : Number(value)
    }))
  }

  const handleSaveChanges = async () => {
    if (!paperId || !originalPaperData) return

    try {
      // Prepare updated data
      const updatedMcqs = questions.mcq.map(q => {
        const originalMcq = paperMcqs.find(m => m.questionId === q.id)
        return {
          questionId: q.id,
          question: q.text,
          options: q.options || [],
          correctAnswer: originalMcq?.correctAnswer,
          marks: mcqMarks ? Math.floor(mcqMarks / questions.mcq.length) : 1,
        }
      })

      const updatedShorts = questions.short.map(q => {
        const originalShort = paperShorts.find(s => s.questionId === q.id)
        return {
          questionId: q.id,
          question: q.text,
          answer: originalShort?.answer,
          marks: marks[q.id] || 5,
        }
      })

      const updatedLongs = questions.long.map(q => {
        const originalLong = paperLongs.find(l => l.questionId === q.id)
        const updatedParts = originalLong?.parts?.map((part, idx) => ({
          ...part,
          marks: marks[`${q.id}-${idx}`] || part.marks,
        })) || []

        return {
          questionId: q.id,
          question: q.text,
          answer: originalLong?.answer,
          totalMarks: marks[q.id] || 10,
          parts: updatedParts,
        }
      })

      // Calculate new total marks
      const newTotalMarks =
        (mcqMarks || 0) +
        updatedShorts.reduce((sum, q) => sum + (q.marks || 0), 0) +
        updatedLongs.reduce((sum, q) => sum + (q.totalMarks || 0), 0)

      const response = await updatePaper({
        id: paperId,
        data: {
          title: paperName,
          totalMarks: newTotalMarks,
          mcqs: updatedMcqs,
          shortQs: updatedShorts,
          longQs: updatedLongs,
        }
      }).unwrap()

      if (response.success) {
        toast({
          title: "Paper updated successfully",
          description: "Your changes have been saved.",
        })
        setHasChanges(false)
        setOriginalPaperData(response.data)
      }
    } catch (error) {
      console.error('Error updating paper:', error)
      toast({
        title: "Error updating paper",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    const subjectId = searchParams.get('subjectId')
    router.push(`/${board}/${classNumber}/${subject}/select-questions${subjectId ? `?subjectId=${subjectId}` : ''}`)
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplateId(template.id)
    // Apply template styles to the paper
    document.body.style.setProperty('--paper-bg-color', template.styles.backgroundColor)
    document.body.style.setProperty('--paper-text-color', template.styles.textColor)
    document.body.style.setProperty('--paper-font-family', template.styles.fontFamily)
  }

  return (
    <PageTransition>
      <style jsx global>{`
        @media print {
          body {
            background-color: var(--paper-bg-color, white) !important;
            color: var(--paper-text-color, black) !important;
            font-family: var(--paper-font-family, serif) !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gray-100 border-b space-y-4">
            <div className="flex justify-between items-center">
              <Link href={`/${board}/${classNumber}/${subject}/select-questions${searchParams.get('subjectId') ? `?subjectId=${searchParams.get('subjectId')}` : ''}`}>
                <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Question Selection
                </Button>
              </Link>
              <div className="space-x-2">
                {hasChanges && (
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Paper
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Paper
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <PaperTemplateSelector onSelect={handleTemplateSelect} selectedTemplateId={selectedTemplateId} />
              <LanguageSelector onLanguageChange={setSelectedLanguage} selectedLanguage={selectedLanguage} />
            </div>
          </div>
          
          {/* Loading State */}
          {(isPaperLoading || isLoadingQuestions) && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading paper...</span>
            </div>
          )}

          {/* Error State */}
          {paperError && !isPaperLoading && (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load paper. Please try again later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Paper Content */}
          {!isPaperLoading && !isLoadingQuestions && !paperError && (
          <div className="p-6" style={{
            backgroundColor: 'var(--paper-bg-color, white)',
            color: 'var(--paper-text-color, black)',
            fontFamily: 'var(--paper-font-family, serif)'
          }}>
            {/* Paper Header */}
            <div className="text-center border-b pb-4 mb-6">
              <h1 className="text-xl font-bold uppercase mb-2">{board.replace('-', ' ')} BOARD OF INTERMEDIATE AND SECONDARY EDUCATION</h1>
              <Input
                type="text"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
                className="text-center font-bold mb-2"
              />
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <p>Time:</p>
                    <Input
                      type="text"
                      className="w-20 h-6 text-sm"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                    />
                    <p>Hours</p>
                  </div>
                  <p>Class: {classNumber}</p>
                </div>
                <div className="text-right">
                  <p>Maximum Marks: {mcqMarks}</p>
                  <p>Subject: {subject}</p>
                </div>
              </div>
              {selectedLanguage === 'both' && (
                <p className="text-sm italic">Note: Questions are provided in both English and Urdu</p>
              )}
            </div>

            {/* MCQs Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Section A: Multiple Choice Questions</h2>
                <div className="flex items-center space-x-2">
                  <label htmlFor="mcq-marks" className="text-sm font-medium">Total Marks:</label>
                  <Input
                    id="mcq-marks"
                    type="number"
                    className="w-20"
                    value={mcqMarks || ''}
                    onChange={(e) => setMcqMarks(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {questions.mcq.map((question, index) => (
                  <div key={question.id} className="pl-4">
                    <EditableQuestion
                      initialText={`${index + 1}. ${question.text}`}
                      onSave={(newText) => handleQuestionEdit('mcq', question.id, newText.replace(/^\d+\.\s*/, ''))}
                    />
                    {question.options && (
                      <div className="pl-8 mt-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <span>{String.fromCharCode(97 + optionIndex)})</span>
                            <EditableMcq
                              initialText={option}
                              onSave={(newText) => handleMCQOptionEdit(question.id, optionIndex, newText)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Short Questions Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Section B: Short Questions</h2>
              <div className="space-y-4">
                {questions.short.map((question, index) => (
                  <div key={question.id} className="flex justify-between items-start pl-4">
                    <EditableQuestion
                      initialText={`${index + 1}. ${question.text}`}
                      onSave={(newText) => handleQuestionEdit('short', question.id, newText.replace(/^\d+\.\s*/, ''))}
                    />
                    <Input
                      type="number"
                      placeholder="Marks"
                      className="w-20 ml-4"
                      value={marks[question.id] || ''}
                      onChange={(e) => handleMarksChange(question.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Long Questions Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Section C: Long Questions</h2>
              <div className="space-y-6">
                {questions.long.map((question, index) => (
                  <div key={question.id} className="pl-4">
                    <EditableQuestion
                      initialText={`${index + 1}. ${question.text}`}
                      onSave={(newText) => handleQuestionEdit('long', question.id, newText.replace(/^\d+\.\s*/, ''))}
                    />
                    {question.parts && question.parts.length > 0 && (
                      <div className="pl-8 mt-2 space-y-2">
                        {question.parts.map((part, partIndex) => (
                          <div key={partIndex} className="flex justify-between items-start">
                            <EditableQuestion
                              initialText={part}
                              onSave={(newText) => {
                                if (question.parts) {
                                  const newParts = [...question.parts]
                                  newParts[partIndex] = newText
                                  setQuestions(prev => ({
                                    ...prev,
                                    long: prev.long.map(q => q.id === question.id ? { ...q, parts: newParts } : q)
                                  }))
                                }
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Marks"
                              className="w-20 ml-4"
                              value={marks[`${question.id}-${partIndex}`] || ''}
                              onChange={(e) => handleMarksChange(`${question.id}-${partIndex}`, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

