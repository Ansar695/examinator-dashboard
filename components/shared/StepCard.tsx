'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface StepsCardProps {
  step: string
  title: string
  description: string
  icon: React.ReactNode
}

export function StepsCard({ step, title, description, icon }: StepsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Step {step}</p>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
