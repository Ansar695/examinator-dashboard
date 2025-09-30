/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import { PageTransition } from '@/components/shared/Transition'
import { QuestionItem } from '@/components/questions/QuestionItem'
import { Badge } from '@/components/ui/badge'

interface McqProps {
    id: string;
    text: string;
    options: string[]
}
interface ShortProps {
    id: string;
    text: string;
}
interface LongProps {
    id: string;
    text: string;
}

interface QuestionsProps {
    mcq: McqProps[]
    short: ShortProps[]
    long: LongProps[]
}

// Mock data for questions (replace with actual data from your backend)
const questions: any = {
  mcq: [
    { id: 'mcq1', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'] },
    { id: 'mcq2', text: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'] },
    { id: 'mcq3', text: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'] },
    { id: 'mcq4', text: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Fe', 'Cu'] },
    { id: 'mcq5', text: 'In which year did World War II end?', options: ['1943', '1945', '1947', '1950'] },
  ],
  short: [
    { id: 'short1', text: 'Explain the process of photosynthesis.' },
    { id: 'short2', text: 'Describe the water cycle.' },
    { id: 'short3', text: 'What are the main causes of climate change?' },
    { id: 'short4', text: 'Outline the structure of an atom.' },
    { id: 'short5', text: 'Summarize the plot of "To Kill a Mockingbird".' },
  ],
  long: [
    { id: 'long1', text: 'Discuss the impacts of the Industrial Revolution on society and the environment.' },
    { id: 'long2', text: 'Analyze the themes in George Orwell\'s "1984".' },
    { id: 'long3', text: 'Evaluate the pros and cons of renewable energy sources.' },
    { id: 'long4', text: 'Explain the theory of evolution and provide supporting evidence.' },
    { id: 'long5', text: 'Compare and contrast the American and French Revolutions.' },
  ],
}

export default function SelectQuestions() {
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, string[]>>({
    mcq: [],
    short: [],
    long: [],
  })
  const params = useParams()
  const router = useRouter()
  const board = params.board as string
  const classNumber = params.class as string
  const subject = params.subject as string

  const handleQuestionSelect = (type: 'mcq' | 'short' | 'long', id: string, selected: boolean) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [type]: selected
        ? [...prev[type], id]
        : prev[type].filter(qId => qId !== id)
    }))
  }

  const handleRandomSelection = (type: 'mcq' | 'short' | 'long') => {
    const allQuestions = questions[type]
    const selectedCount = Math.min(3, allQuestions.length)
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, selectedCount).map(q => q.id)
    setSelectedQuestions(prev => ({
      ...prev,
      [type]: selected
    }))
  }

  const handleContinue = () => {
    console.log('Selected questions:', selectedQuestions)
    // Navigate to the next page (e.g., paper preview or final step)
    router.push(`/${board}/${classNumber}/${subject}/view-paper`)
    alert('Questions selected! Proceeding to paper preview...')
  }

  const getTotalSelectedQuestions = () => {
    return Object.values(selectedQuestions).reduce((sum, arr) => sum + arr.length, 0)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <Link href={`/${board}/${classNumber}/${subject}/select-topics`}>
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Topic Selection
              </Button>
            </Link>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Selected: {getTotalSelectedQuestions()}
            </Badge>
          </div>
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
              {board.replace('-', ' ')} - Class {classNumber} - {subject}
            </p>
          </motion.div>

          <Tabs defaultValue="mcq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mcq">MCQs</TabsTrigger>
              <TabsTrigger value="short">Short Questions</TabsTrigger>
              <TabsTrigger value="long">Long Questions</TabsTrigger>
            </TabsList>
            {(['mcq', 'short', 'long'] as const).map((type) => (
              <TabsContent key={type} value={type}>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {type === 'mcq' ? 'Multiple Choice Questions' : `${type.charAt(0).toUpperCase() + type.slice(1)} Questions`}
                  </h2>
                  <Button
                    onClick={() => handleRandomSelection(type)}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Random Select
                  </Button>
                </div>
                {questions[type].map((question: any) => (
                  <QuestionItem
                    key={question.id}
                    id={question.id}
                    text={question.text}
                    type={type}
                    options={question?.options}
                    onSelect={(id, selected) => handleQuestionSelect(type, id, selected)}
                  />
                ))}
              </TabsContent>
            ))}
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Button 
              size="lg" 
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Preview Paper
              <ArrowRight className="ml-2 h-5 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

