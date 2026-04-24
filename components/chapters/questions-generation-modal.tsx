"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Loader2 } from "lucide-react"
import { QuestionEditor } from "./question-editor"
import { EMBEDDINGS_BASE_URL } from "@/config"
import { useToast } from "../common/CustomToast"

export interface Question {
  id: string
  question: string
  difficulty: string
  options?: string[]
  answer_index?: string
  questionType: string
  answer?: string;
  subTopic?: string;
}

type GenerationResult =
  | { ok: true; topic: string; questions: Question[] }
  | { ok: false; topic: string; error: string }

interface QuestionGenerationModalProps {
  open: boolean
  onClose: () => void
  onSaveQuestions: (questions: Question[], qType: string, subTopic?: string) => Promise<{ success: boolean; message: string }>
  classNumber: string | null
  chapterName: string
  subTopics?: string[]
  isSaving: boolean;
}

export function QuestionGenerationModal({
  classNumber,
  chapterName,
  subTopics = [],
  open,
  onClose,
  onSaveQuestions,
  isSaving,
}: QuestionGenerationModalProps) {
  const [questionType, setQuestionType] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [marksPerQuestion, setMarksPerQuestion] = useState("")
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [qType, setQType] = useState<string>("mcqs")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerated, setShowGenerated] = useState(false)
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])
  const [isSavingLocal, setIsSavingLocal] = useState(false)
  
  const { showSuccess, showError, showWarning, ToastComponent } = useToast();
  const isSavingQuestions = isSaving || isSavingLocal;

  const runWithConcurrencyProgress = async <T,>(
    tasks: Array<() => Promise<T>>,
    limit: number,
    onResult: (result: T) => void
  ): Promise<T[]> => {
    const results: T[] = new Array(tasks.length)
    let nextIndex = 0

    const worker = async () => {
      while (nextIndex < tasks.length) {
        const current = nextIndex
        nextIndex += 1
        const result = await tasks[current]()
        results[current] = result
        onResult(result)
      }
    }

    const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
    await Promise.all(workers)
    return results
  }

  const handleGenerateQuestions = async () => {
    if (!questionType || !totalQuestions || !marksPerQuestion) return
    if (questionType === "essay") {
      showError("Essay question generation is not available yet.")
      return
    }
    if (subTopics.length && selectedSubtopics.length === 0) {
      showError("Please select at least one subtopic to generate questions.")
      return
    }

    setIsGenerating(true)
    setGeneratedQuestions([])
    setShowGenerated(false)
    
    try {
        if(!classNumber) showSuccess("Please enter class number (e.g. 11, 12).")
        if(!chapterName) showSuccess("Please enter chapter name.")

        let urlType = `${EMBEDDINGS_BASE_URL}/generate_mcqs`
        if(questionType === "short"){
          urlType = `${EMBEDDINGS_BASE_URL}/generate_short_questions`
        } else if (questionType === "long") {
          urlType = `${EMBEDDINGS_BASE_URL}/generate_long_questions`
        }

        if(!urlType) showSuccess("Unable to access this feature, please check network connection.")

        const topicsToGenerate = subTopics.length ? selectedSubtopics : [""]

        const tasks: Array<() => Promise<GenerationResult>> = topicsToGenerate.map((topic) => async () => {
          try {
              const formData = new FormData()
              formData.append("subject", chapterName)
              formData.append("book", classNumber as string)
              formData.append("chapter", chapterName)
              formData.append("n", totalQuestions)
              if (topic) {
                formData.append("subtopics", topic)
              }

              const genResponse = await fetch(urlType, {
                method: "POST",
                body: formData,
              })
              const parsedResp = await genResponse.json()
              if (!genResponse?.ok || !parsedResp?.success) {
                return {
                  ok: false,
                  topic,
                  error: parsedResp?.details ?? "Something went wrong, please try again later",
                }
              }

              const questionsWithTopic = (parsedResp?.questions ?? []).map((q: Question) => ({
                ...q,
                subTopic: topic || undefined,
              }))

              return {
                ok: true,
                topic,
                questions: questionsWithTopic,
              }
            } catch {
              return {
                ok: false,
                topic,
                error: "Something went wrong, please try again later",
              }
            }
          }
        )

        const failed: Array<{ ok: false; topic: string; error: string }> = []

        const results = await runWithConcurrencyProgress(tasks, 3, (result) => {
          if (result.ok) {
            const questions = result.questions ?? []
            if (questions.length > 0) {
              setGeneratedQuestions((prev) => [...prev, ...questions])
              setShowGenerated(true)
              setQType(questionType)
            }
          } else {
            failed.push(result)
          }
        })

        const successful = results.filter((r) => r.ok) as Array<{ ok: true; topic: string; questions: Question[] }>
        const combinedQuestions = successful.flatMap((r) => r.questions)

        if (combinedQuestions.length === 0) {
          showError(failed[0]?.error || "Failed to generate questions.")
          setIsGenerating(false)
          return
        }

        showSuccess(`Generated ${combinedQuestions.length} questions`)
        if (failed.length > 0) {
          const failedTopics = failed.map((f) => (f.topic ? `"${f.topic}"` : "General")).join(", ")
          showWarning(`Some topics failed to generate: ${failedTopics}`)
        }
      } catch (error) {
        console.log("error", error);
        setIsGenerating(false);
        showError("Something went wrong, please try again lator")
        return error;
      }

    // setGeneratedQuestions(newQuestions)
    setIsGenerating(false)
  }

  const handleUpdateQuestion = (id: string, updatedQuestion: Question) => {
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)))
  }

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSaveAllQuestions = async () => {
    if (generatedQuestions.length === 0) {
      showError("No questions to save.")
      return
    }
    setIsSavingLocal(true)
    try {
      const result = await onSaveQuestions(generatedQuestions, qType, undefined)
      if (result?.success) {
        showSuccess(result.message || "Questions saved successfully")
        setGeneratedQuestions([])
        setShowGenerated(false)
        setTotalQuestions("")
        setMarksPerQuestion("")
        setQuestionType("")
        setSelectedSubtopics([])
        onClose()
      } else {
        showError(result?.message || "Failed to save questions. Please try again.")
      }
    } catch (error) {
      console.error("Save questions error:", error)
      showError("Failed to save questions. Please try again.")
    } finally {
      setIsSavingLocal(false)
    }
  }

  const handleClose = () => {
    setQuestionType("")
    setTotalQuestions("")
    setMarksPerQuestion("")
    setShowGenerated(false)
    setGeneratedQuestions([])
    setIsGenerating(false)
    setSelectedSubtopics([])
    onClose()
  }

  const toggleSubtopic = (topic: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const isAllSelected = subTopics.length > 0 && selectedSubtopics.length === subTopics.length

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedSubtopics([])
    } else {
      setSelectedSubtopics([...subTopics])
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !isSavingQuestions) {
          handleClose()
        }
      }}
    >
      <DialogContent className="min-w-[75%] max-w-[1000px] h-[85vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Generate AI Questions
          </DialogTitle>
          <DialogDescription>
            {showGenerated
              ? "Review and edit the generated questions before saving"
              : "Configure the type and number of questions to generate from this chapter"}
          </DialogDescription>
        </DialogHeader>

        {!showGenerated ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Question Type *</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger className="w-full border border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcqs">Multiple Choice Questions</SelectItem>
                    <SelectItem value="short">Short Questions</SelectItem>
                    <SelectItem value="long">Long Questions</SelectItem>
                    <SelectItem value="essay">Essay Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Number of Questions *</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  placeholder="e.g., 5"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  min="1"
                  max="200"
                  className="w-full border border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marksPerQuestion">Marks per Question *</Label>
                <Input
                  id="marksPerQuestion"
                  type="number"
                  placeholder="e.g., 2"
                  value={marksPerQuestion}
                  onChange={(e) => setMarksPerQuestion(e.target.value)}
                  min="1"
                  max="50"
                  className="w-full border border-gray-300"
                />
              </div>
            </div>
            {subTopics.length ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Select Subtopics *</Label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {isAllSelected ? "Clear All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {subTopics.map((t) => {
                    const checked = selectedSubtopics.includes(t)
                    return (
                      <label
                        key={`${chapterName}::${t}`}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                          checked ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSubtopic(t)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="text-slate-700">{t}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
              {/* <p className="text-sm text-slate-600">
                Generated {generatedQuestions?.length} questions • Total marks:{" "}
                {generatedQuestions?.reduce((sum, q) => sum + q.marks, 0)}
              </p> */}
              <Button variant="outline" size="sm" onClick={() => setShowGenerated(false)} disabled={isSavingQuestions}>
                Back to Settings
              </Button>
            </div>

            <ScrollArea className="h-[85%] pr-4">
              <div className="space-y-4">
                {generatedQuestions?.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    qType={qType}
                    index={index}
                    onUpdate={handleUpdateQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={isSavingQuestions}>
            Cancel
          </Button>
          {!showGenerated ? (
            <Button
              onClick={handleGenerateQuestions}
              disabled={!questionType || !totalQuestions || !marksPerQuestion || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Questions
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSaveAllQuestions}
              disabled={generatedQuestions.length === 0 || isSavingQuestions || isGenerating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSavingQuestions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `Save ${generatedQuestions.length} Questions`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      {ToastComponent}
    </Dialog>
  )
}
