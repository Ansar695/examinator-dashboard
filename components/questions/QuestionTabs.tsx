"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, HelpCircle, FileText } from "lucide-react"

interface QuestionTabsProps {
  currentTab: string
  onTabChange: (value: string) => void
  mcqCount: number
  shortCount: number
  longCount: number
}

export function QuestionTabs({ currentTab, onTabChange, mcqCount, shortCount, longCount }: QuestionTabsProps) {
  const tabs = [
    {
      value: "mcq",
      label: "MCQs",
      icon: HelpCircle,
      count: mcqCount,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "short",
      label: "Short Questions",
      icon: FileText,
      count: shortCount,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "long",
      label: "Long Questions",
      icon: BookOpen,
      count: longCount,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <div className="relative mb-8">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0 h-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.value

            return (
              <motion.div key={tab.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger
                  value={tab.value}
                  className={`relative px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/30`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                      isActive ? "bg-white/30 text-white" : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </motion.span>
                </TabsTrigger>
              </motion.div>
            )
          })}
        </TabsList>
      </div>

      {/* Tab Content Wrapper */}
      <div className="relative">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Content will be injected here */}
            </motion.div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
