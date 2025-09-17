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

interface Question {
  id: number
  question: string
  type: string
  marks: number
  options?: string[]
  correctAnswer?: string
  expectedAnswer?: string
}

interface QuestionGenerationModalProps {
  open: boolean
  onClose: () => void
  onSaveQuestions: (questions: Question[]) => void
  classNumber: string | null
  chapterName: string
}

// Static question templates for demonstration
const staticQuestionTemplates = {
  mcqs: [
    {
      question: "What is the primary function of mitochondria in a cell?",
      options: ["Protein synthesis", "Energy production", "DNA storage", "Waste removal"],
      correctAnswer: "Energy production",
    },
    {
      question: "Which of the following is NOT a renewable energy source?",
      options: ["Solar power", "Wind power", "Coal", "Hydroelectric power"],
      correctAnswer: "Coal",
    },
    {
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "CH4"],
      correctAnswer: "H2O",
    },
  ],
  short: [
    {
      question: "Explain the process of photosynthesis in plants.",
      expectedAnswer:
        "Photosynthesis is the process by which plants convert light energy into chemical energy using chlorophyll, carbon dioxide, and water to produce glucose and oxygen.",
    },
    {
      question: "What are the main components of the water cycle?",
      expectedAnswer:
        "The water cycle consists of evaporation, condensation, precipitation, and collection, forming a continuous cycle of water movement.",
    },
    {
      question: "Define Newton's first law of motion.",
      expectedAnswer:
        "Newton's first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
    },
  ],
  long: [
    {
      question: "Discuss the impact of climate change on global ecosystems and propose potential solutions.",
      expectedAnswer:
        "Climate change significantly affects global ecosystems through rising temperatures, changing precipitation patterns, and extreme weather events. Solutions include renewable energy adoption, reforestation, and sustainable practices.",
    },
    {
      question: "Analyze the causes and effects of the Industrial Revolution on society.",
      expectedAnswer:
        "The Industrial Revolution was caused by technological innovations, population growth, and capital accumulation, leading to urbanization, social changes, and economic transformation.",
    },
  ],
  essay: [
    {
      question: "Analyze the role of technology in modern education and its future implications.",
      expectedAnswer:
        "Technology has revolutionized modern education by providing new tools, methods, and accessibility. Future implications include personalized learning, AI tutors, and global classroom connectivity.",
    },
    {
      question: "Evaluate the impact of globalization on developing countries.",
      expectedAnswer:
        "Globalization has brought both opportunities and challenges to developing countries, including economic growth, cultural exchange, but also inequality and dependency issues.",
    },
  ],
}

export function QuestionGenerationModal({ classNumber, chapterName, open, onClose, onSaveQuestions }: QuestionGenerationModalProps) {
  const [questionType, setQuestionType] = useState("")
  const [totalQuestions, setTotalQuestions] = useState("")
  const [marksPerQuestion, setMarksPerQuestion] = useState("")
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerated, setShowGenerated] = useState(false)
  
  const { showSuccess, showError, ToastComponent } = useToast();

   const genrateAIQuestions = async (
      questionType: string,
      totalQuestions: any
    ) => {
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
        formData.append("subject", chapterName);
        formData.append("book", classNumber as string);
        formData.append("chapter", chapterName);
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
        console.log("genResponse ", genResponse)
        console.log("genResponse parsedResp", parsedResp)
        if (!genResponse?.ok) {
          showError(parsedResp?.details ?? "Failed to create embeddings.");
        } else {
          if (parsedResp.success) {
            showSuccess("Questions generated successfully");
          }
        }
      } catch (error) {
        console.log("error", error);
        setIsGenerating(false);
        return error;
      }
    };

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
        console.log("genResponse ", genResponse)
        console.log("genResponse parsedResp", parsedResp)
        if (!genResponse?.ok) {
          showError(parsedResp?.details ?? "Failed to create embeddings.");
        } else {
          if (parsedResp.success) {
            setGeneratedQuestions(parsedResp?.questions ?? [])
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

    // Simulate API call delay
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // const questionsToGenerate = Number.parseInt(totalQuestions)
    // const marks = Number.parseInt(marksPerQuestion)
    // const templates = staticQuestionTemplates[questionType as keyof typeof staticQuestionTemplates] || []

    // const newQuestions: Question[] = Array.from({ length: questionsToGenerate }, (_, index) => {
    //   const template = templates[index % templates.length]
    //   return {
    //     id: Date.now() + index,
    //     question: template.question,
    //     type: questionType,
    //     marks: marks,
    //     options: template?.options,
    //     correctAnswer: template?.correctAnswer,
    //     expectedAnswer: template?.expectedAnswer,
    //   }
    // })

    // setGeneratedQuestions(newQuestions)
    setIsGenerating(false)
    setShowGenerated(true)
  }

  const handleUpdateQuestion = (id: number, updatedQuestion: Question) => {
    setGeneratedQuestions((prev) => prev.map((q) => (q.id === id ? updatedQuestion : q)))
  }

  const handleDeleteQuestion = (id: number) => {
    setGeneratedQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSaveAllQuestions = () => {
    onSaveQuestions(generatedQuestions)
    handleClose()
  }

  const handleClose = () => {
    setQuestionType("")
    setTotalQuestions("")
    setMarksPerQuestion("")
    setGeneratedQuestions([])
    setShowGenerated(false)
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
              <p className="text-sm text-slate-600">
                Generated {generatedQuestions?.length} questions • Total marks:{" "}
                {generatedQuestions?.reduce((sum, q) => sum + q.marks, 0)}
              </p>
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
              disabled={generatedQuestions.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save {generatedQuestions.length} Questions
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      {ToastComponent}
    </Dialog>
  )
}
