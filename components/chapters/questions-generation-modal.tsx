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
}

interface QuestionGenerationModalProps {
  open: boolean
  onClose: () => void
  onSaveQuestions: (questions: Question[], qType: string) => void
  classNumber: string | null
  chapterName: string
  isSaving: boolean;
}

export function QuestionGenerationModal({ classNumber, chapterName, open, onClose, onSaveQuestions, isSaving }: QuestionGenerationModalProps) {
  const [questionType, setQuestionType] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [marksPerQuestion, setMarksPerQuestion] = useState("")
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [qType, setQType] = useState<string>("mcqs")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerated, setShowGenerated] = useState(false)
  
  const { showSuccess, showError, ToastComponent } = useToast();

  const handleGenerateQuestions = async () => {
    if (!questionType || !totalQuestions || !marksPerQuestion) return

    setIsGenerating(true)
    
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

        const formData = new FormData();
        formData.append("subject", 'Periodic Table and Periodic Properties');
        formData.append("book", classNumber as string);
        formData.append("chapter", 'Periodic Table and Periodic Properties');
        formData.append("n", totalQuestions);
        setIsGenerating(true);

        const genResponse = await fetch(
          urlType,
          {
            method: "POST",
            body: formData,
          }
        );
        setIsGenerating(false);
        const parsedResp = await genResponse.json();
        if (!genResponse?.ok) {
          showError(parsedResp?.details ?? "Failed to create embeddings.");
        } else {
          if (parsedResp.success) {
            setGeneratedQuestions(parsedResp?.questions ?? [])
            setQType(parsedResp?.questionType)
            showSuccess("Questions generated successfully");
          }else{
            showError(parsedResp?.details ?? "Something went wrong, please try again lator")
          }
        }
      } catch (error) {
        console.log("error", error);
        setIsGenerating(false);
        showError("Something went wrong, please try again lator")
        return error;
      }

    // setGeneratedQuestions(newQuestions)
    setIsGenerating(false)
    setShowGenerated(true)
  }

  const handleUpdateQuestion = (id: string, updatedQuestion: Question) => {
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)))
  }

  const handleDeleteQuestion = (id: string) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSaveAllQuestions = () => {
    onSaveQuestions(generatedQuestions, qType)
    setGeneratedQuestions([])
    setShowGenerated(false)
    setTotalQuestions("")
    setMarksPerQuestion("")
    setQuestionType("")
  }

  const handleClose = () => {
    setQuestionType("")
    setTotalQuestions("")
    setMarksPerQuestion("")
    setShowGenerated(false)
    setGeneratedQuestions([])
    setIsGenerating(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
              {/* <p className="text-sm text-slate-600">
                Generated {generatedQuestions?.length} questions • Total marks:{" "}
                {generatedQuestions?.reduce((sum, q) => sum + q.marks, 0)}
              </p> */}
              <Button variant="outline" size="sm" onClick={() => setShowGenerated(false)}>
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
          <Button variant="outline" onClick={handleClose}>
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
              disabled={generatedQuestions.length === 0 || isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? 'Saving...' : `Save ${generatedQuestions.length} Questions`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      {ToastComponent}
    </Dialog>
  )
}
