"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Loader2 } from "lucide-react"

interface ActionBarProps {
  selectedCount: number
  totalCount: number
  onRandomSelect: () => void
  onContinue: () => void
  isLoading?: boolean
  isDisabled?: boolean
}

export function ActionBar({
  selectedCount,
  totalCount,
  onRandomSelect,
  onContinue,
  isLoading = false,
  isDisabled = false,
}: ActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center justify-between gap-4 mt-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
    >
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-slate-600 mb-1">Questions Selected</p>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg px-4 py-2">
              {selectedCount}
            </Badge>
            <span className="text-slate-500">of {totalCount}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRandomSelect}
            variant="outline"
            disabled={isLoading || totalCount === 0}
            className="rounded-lg font-semibold border-2 hover:border-purple-500 hover:text-purple-600 bg-transparent"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Random Select
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onContinue}
            disabled={isDisabled || isLoading}
            className="rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Preview Paper
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
