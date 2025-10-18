import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface ClassSelectionCardProps {
  classNumber: number
  onClick: () => void
  isSelected: boolean
}

export function ClassSelectCard({ classNumber, onClick, isSelected }: ClassSelectionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`} 
        onClick={onClick}
      >
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isSelected ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-blue-600">Class {classNumber}</h3>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

