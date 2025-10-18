"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface QuestionCardProps {
  id: string
  text: string
  options?: string[]
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
  type: "mcq" | "short" | "long"
  index: number
}

export function QuestionCard({ id, text, options, isSelected, onSelect, type, index }: QuestionCardProps) {
  const typeColors = {
    mcq: "bg-blue-100 text-blue-700",
    short: "bg-purple-100 text-purple-700",
    long: "bg-orange-100 text-orange-700",
  }

  const typeLabels = {
    mcq: "MCQ",
    short: "Short",
    long: "Long",
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="group"
    >
      <div
        className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
        }`}
        onClick={() => onSelect(id, !isSelected)}
      >
        <div className="flex items-start gap-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="mt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(id, checked as boolean)}
              className="w-6 h-6 rounded-lg"
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={typeColors[type]}>{typeLabels[type]}</Badge>
              <span className="text-xs text-slate-500 font-medium">ID: {id}</span>
            </div>

            <p className="text-slate-700 font-medium leading-relaxed line-clamp-3">{text}</p>

            {options && options.length > 0 && (
              <div className="mt-3 space-y-2">
                {options.slice(0, 2).map((option, idx) => (
                  <div key={idx} className="text-sm text-slate-600 pl-4 border-l-2 border-slate-300">
                    {String.fromCharCode(65 + idx)}) {option}
                  </div>
                ))}
                {options.length > 2 && (
                  <div className="text-xs text-slate-500 italic">+{options.length - 2} more options</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
