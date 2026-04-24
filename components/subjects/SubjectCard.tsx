'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubjectTypes } from '@/utils/types/board'
import { Subject } from '@/lib/api/educationApi'

interface SubjectCardProps {
  subject: Subject;
  onSelect: () => void
}

export function SubjectCard({ subject, onSelect }: SubjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col max-w-[350px]  p-0" onClick={onSelect}>
        <div className="relative h-48">
          <Image
            src={subject?.imageUrl ?? "/placeholder-subject.jpg"}
            alt={subject?.name}
            objectFit="cover"
            width={350}
            height={280}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
          <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{subject?.name}</h3>
        </div>
        <CardContent className="flex-grow flex flex-col justify-between p-4">
          <p className="text-gray-600 mb-4">{subject?.description}</p>
          <Button variant="outline" className="w-full cursor-pointer active:bg-green-800">Select Subject</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

