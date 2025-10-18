"use client"

import { motion } from "framer-motion"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          className="p-5 rounded-xl bg-slate-200 h-24"
        />
      ))}
    </div>
  )
}
