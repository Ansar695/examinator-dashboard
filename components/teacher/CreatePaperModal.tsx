"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CreatePaperModalProps {
  onClose: () => void
}

export default function CreatePaperModal({ onClose }: CreatePaperModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    questions: "30",
    difficulty: "mixed",
    duration: "60",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCreate = () => {
    console.log("Creating paper:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl border-0 shadow-2xl animate-slide-in-up">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create New Paper</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X size={24} className="text-foreground" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Paper Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics Final Exam"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Number of Questions</label>
                  <input
                    type="number"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    min="5"
                    max="100"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="300"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium text-foreground">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium text-foreground capitalize">{formData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium text-foreground">{formData.questions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{formData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium text-foreground capitalize">{formData.difficulty}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Review your paper details above. Click "Create Paper" to proceed with generation.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-4 mt-8">
            <Button onClick={handleBack} variant="outline" disabled={step === 1} className="flex-1 bg-transparent">
              Back
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Next
              </Button>
            ) : (
              <Button onClick={handleCreate} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Paper
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
