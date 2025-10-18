import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

interface BoardSelectionCardProps {
  name: string
  description: string
  image: string
  onClick: () => void
  isSelected: boolean
}

export function SelectionCard({ name, description, image, onClick, isSelected }: BoardSelectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`} 
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 transform hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-2xl font-bold">{name}</h3>
              <p className="mt-2 text-sm">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

