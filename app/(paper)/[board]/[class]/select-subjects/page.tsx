'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { PageTransition } from '@/components/shared/Transition'
import { SubjectCard } from '@/components/subjects/SubjectCard'
import { useEffect } from 'react'
import { useGetSubjectsMutation } from '@/redux/services/subjects'
import { useToast } from '@/hooks/use-toast'
import CustomSpinner from '@/components/shared/CustomSpinner'
import { SubjectTypes } from '@/utils/types/board'

// This would typically come from an API or database


export default function SelectSubject() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const board = params?.board as string
  const classNumber = params?.class as string

    const [getSubjects, { data, isLoading }] = useGetSubjectsMutation();
  console.log("data ", data)
    const getSubjectsData = async () => {
      try {
        const response = await getSubjects({board, classNumber}).unwrap();
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
      getSubjectsData();
    }, []);

  // const subjects = subjectsData[board as keyof typeof subjectsData]?.[parseInt(classNumber) as keyof typeof subjectsData['punjab-board']] || []

  const handleSubjectSelection = (slug: string, id: string) => {
    router.push(`/${board}/${classNumber}/${slug}/select-topics?subjectId=${id}`)
  }

  const boardName = board === 'punjab-board' ? 'Punjab Board' : 'Federal Board'

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href={`/${board}/select-class`}>
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Class Selection
              </Button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">Select Your Subject</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              {boardName} - Class {classNumber}
            </p>
          </motion.div>
          {isLoading ? <CustomSpinner /> : 
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data?.map((subject: SubjectTypes, index: number) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SubjectCard
                subject={subject}
                onSelect={() => handleSubjectSelection(subject?.slug, subject?.id)}
              />
            </motion.div>
          ))}
        </div>
          }
        </div>
      </div>
    </PageTransition>
  )
}

