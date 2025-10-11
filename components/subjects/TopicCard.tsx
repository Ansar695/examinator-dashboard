import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Subtopic } from '@/utils/static-data/topics'

interface TopicCardProps {
  name: string
  // subtopics: Subtopic[]
  onSelect: (topic: string, subtopics: string[]) => void
}

export function TopicCard({ name, onSelect }: TopicCardProps) {
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])
  const [allSelected, setAllSelected] = useState(false)

  // useEffect(() => {
  //   setAllSelected(selectedSubtopics.length === subtopics.length)
  // }, [selectedSubtopics, subtopics])

  const handleSubtopicToggle = (subtopic: string) => {
    setSelectedSubtopics(prev => {
      const newSelection = prev.includes(subtopic)
        ? prev.filter(t => t !== subtopic)
        : [...prev, subtopic]
      onSelect(name, newSelection)
      return newSelection
    })
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedSubtopics([])
      onSelect(name, [])
    } else {
      // setSelectedSubtopics([...subtopics])
      // onSelect(name, [...subtopics])
    }
    setAllSelected(!allSelected)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <span>{name}</span>
            <Checkbox
              id={`${name}-all`}
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
            />
          </CardTitle>
        </CardHeader>
        {/* <CardContent className="pt-4">
          <div className="space-y-2">
            {subtopics.map((subtopic) => (
              <div key={subtopic} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 transition-colors duration-200">
                <Checkbox
                  id={`${name}-${subtopic}`}
                  checked={selectedSubtopics.includes(subtopic)}
                  onCheckedChange={() => handleSubtopicToggle(subtopic)}
                />
                <Label
                  htmlFor={`${name}-${subtopic}`}
                  className="text-sm cursor-pointer flex-grow"
                >
                  {subtopic}
                </Label>
              </div>
            ))}
          </div>
        </CardContent> */}
      </Card>
    </motion.div>
  )
}
