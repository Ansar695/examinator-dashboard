/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Topic, topicsData } from '@/utils/static-data/topics'
import { PageTransition } from '@/components/shared/Transition'
import { TopicCard } from '@/components/subjects/TopicCard'
import { useGetChaptersMutation } from '@/redux/services/chapters'
import { useToast } from '@/hooks/use-toast'

export default function SelectTopics() {
  const [selectedTopics, setSelectedTopics] = useState<Record<string, string[]>>({})
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const board = params.board as any
  const classNumber = params.class as string
  const subject = params.subject as string
  const subjectId = searchParams.get("subjectId")

    const [getChapters, { data, isLoading }] = useGetChaptersMutation();
  console.log("data ", data)
    const getChatptersData = async () => {
      try {
        const response = await getChapters(subjectId).unwrap();
        if(!response){
          toast({
            title: "No board found.",
            description: "There is no board added yet.",
          })
        }
      } catch (error: any) {
        console.log(error);
        toast({
          variant: 'destructive',
          title: "Error.",
          description: "Something went wrong, please refresh the page.",
        })
      }
    };

    useEffect(() => {
      getChatptersData();
    }, []);

  const topics: Topic[] = topicsData[board]?.[classNumber]?.[subject] || []

  const handleTopicSelection = (topic: string, subtopics: string[]) => {
    setSelectedTopics(prev => ({
      ...prev,
      [topic]: subtopics
    }))
  }

  const handleContinue = () => {
    const selectedTopicsAndSubtopics = Object.entries(selectedTopics)
      .filter(([_, subtopics]) => subtopics.length > 0)
      .reduce((acc, [topic, subtopics]) => {
        acc[topic] = subtopics
        return acc
      }, {} as Record<string, string[]>)

    if (Object.keys(selectedTopicsAndSubtopics).length > 0) {
      console.log('Selected topics and subtopics:', selectedTopicsAndSubtopics)
      alert('Topics selected! Proceeding to paper creation...')
      router.push(`/${board}/${classNumber}/${subject}/select-questions`)
    } else {
      alert('Please select at least one topic to continue.')
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href={`/${board}/${classNumber}/select-subjects`}>
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Subject Selection
              </Button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Select Topics for Your Paper
            </h1>
            <p className="text-xl text-gray-600">
              {board.replace('-', ' ')} - Class {classNumber} - {subject}
            </p>
          </motion.div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {topics.map((topic, index) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TopicCard
                  name={topic.name}
                  subtopics={topic.subtopics}
                  onSelect={handleTopicSelection}
                />
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {Object.keys(selectedTopics).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-12 text-center"
              >
                <p className="text-2xl font-semibold mb-4 text-gray-800">
                  You have selected topics. Ready to create your paper?
                </p>
                <Button 
                  size="lg" 
                  onClick={handleContinue}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

