'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageTransition } from '@/components/shared/Transition'
import { ClassSelectCard } from '@/components/shared/ClassSelectCard'

export default function SelectClass() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const board = searchParams.get('board')

  const classes = [5, 6, 7, 8, 9, 10, 11, 12]

  const handleClassSelection = (classNumber: number) => {
    setSelectedClass(classNumber)
  }

  const handleContinue = () => {
    if (selectedClass) {
      router.push(`/select-subject?board=${encodeURIComponent(board || '')}&class=${selectedClass}`)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href="/select-board">
              <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Board Selection
              </Button>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-4">Select Your Class</h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              Choose the class for which you want to create an exam.
            </p>
          </motion.div>
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {classes.map((classNumber) => (
              <ClassSelectCard
                key={classNumber}
                classNumber={classNumber}
                onClick={() => handleClassSelection(classNumber)}
                isSelected={selectedClass === classNumber}
              />
            ))}
          </div>
          <AnimatePresence>
            {selectedClass && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-12 text-center"
              >
                <p className="text-2xl font-semibold mb-4">
                  You have selected: Class {selectedClass}
                </p>
                <Button size="lg" onClick={handleContinue}>
                  Continue to Subject Selection
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

