import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface QuestionItemProps {
  question: any;
  onSelect: (id: string, selected: boolean) => void;
  initialSelected?: boolean;
}

export function QuestionItem({ question, onSelect, initialSelected = false }: QuestionItemProps) {
  const [isSelected, setIsSelected] = useState(initialSelected)

  // Update selected state when initialSelected prop changes
  useEffect(() => {
    setIsSelected(initialSelected)
  }, [initialSelected])

  const handleToggle = () => {
    setIsSelected(!isSelected)
    console.log("toggle button handling...")
    onSelect(question?.id, !isSelected)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`p-6 rounded-lg shadow-md mb-6 cursor-pointer transition-all duration-300 ${
        isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white hover:shadow-lg'
      }`}
      // onClick={handleToggle}
    >
      <div className="flex items-start space-x-4">
        <Checkbox
          id={question?.id}
          checked={isSelected}
          onCheckedChange={handleToggle}
          className="mt-1 w-5 h-5 border-gray-600"
        />
        <div className="flex-grow">
          <Label htmlFor={question?.id} className="text-lg font-semibold text-gray-800 mb-2 block cursor-pointer">
            {question?.question}
          </Label>
          {question?.options && (
            <RadioGroup className="space-y-2 mt-3">
              {question?.options?.map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem disabled value={`option-${index}`} id={`${question?.id}-option-${index}`} className='w-4 h-4 border-gray-500' />
                  <Label htmlFor={`${question?.id}-option-${index}`} className="text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>
    </motion.div>
  )
}
