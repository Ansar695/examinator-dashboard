"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="mb-4"
      >
        <BookOpen className="w-16 h-16 text-slate-300" />
      </motion.div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md">{description}</p>
    </motion.div>
  )
}
