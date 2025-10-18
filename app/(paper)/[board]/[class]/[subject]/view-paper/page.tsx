'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Printer, Edit } from 'lucide-react'
import { PageTransition } from '@/components/shared/Transition'
import { PaperTemplateSelector } from '@/components/questions/PaperTemplates'
import { LanguageSelector } from '@/components/questions/LanguageSelector'
import { EditableQuestion } from '@/components/questions/EditableQuestion'
import { EditableMcq } from '@/components/questions/EditableMcq'

// Mock data for selected questions (replace with actual data in a real application)
const initialQuestions = {
  mcq: [
    { id: 'mcq1', text: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'] },
    { id: 'mcq2', text: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter', 'Saturn'] },
  ],
  short: [
    { id: 'short1', text: 'Explain the process of photosynthesis.' },
    { id: 'short2', text: 'Describe the water cycle.' },
  ],
  long: [
    { 
      id: 'long1', 
      text: 'Discuss the impacts of the Industrial Revolution.',
      parts: [
        'a) Describe the major technological advancements during the Industrial Revolution.',
        'b) Explain how these advancements affected society and the environment.'
      ]
    },
    { 
      id: 'long2', 
      text: 'Analyze the themes in George Orwell\'s "1984".',
      parts: [
        'a) Identify and explain the main themes present in the novel.',
        'b) Discuss how these themes relate to the historical context of the book\'s publication.'
      ]
    },
  ],
}

export default function PreviewPaper() {
  const [questions, setQuestions] = useState(initialQuestions)
  const [mcqMarks, setMcqMarks] = useState<number | undefined>()
  const [marks, setMarks] = useState<Record<string, number | undefined>>({})
  const [selectedTemplateId, setSelectedTemplateId] = useState('punjab-board-standard')
  const [selectedLanguage, setSelectedLanguage] = useState('english')
  const [examTime, setExamTime] = useState('2:30')
  const [paperName, setPaperName] = useState('Annual Examination')
  const params = useParams()
  const router = useRouter()
  const board = params.board as string
  const classNumber = params.class as string
  const subject = params.subject as string

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
        q.id === questionId 
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

  const handlePrint = () => {
    window.print()
  }

  const handleEdit = () => {
    router.push(`/${board}/${classNumber}/${subject}/select-questions`)
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
              <Link href={`/${board}/${classNumber}/${subject}/select-questions`}>
                <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Question Selection
                </Button>
              </Link>
              <div className="space-x-2">
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
                    <div className="pl-8 mt-2 space-y-2">
                      {question.parts.map((part, partIndex) => (
                        <div key={partIndex} className="flex justify-between items-start">
                          <EditableQuestion
                            initialText={part}
                            onSave={(newText) => {
                              const newParts = [...question.parts]
                              newParts[partIndex] = newText
                              setQuestions(prev => ({
                                ...prev,
                                long: prev.long.map(q => q.id === question.id ? { ...q, parts: newParts } : q)
                              }))
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

