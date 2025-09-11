"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, X } from "lucide-react"
import {
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useGetClassesQuery,
  useGetSubjectsByClassQuery,
} from "@/lib/api/educationApi"
import { generateSlug } from "@/lib/utils/slugify"

const chapterSchema = z.object({
  name: z.string().min(1, "Chapter name is required").max(100, "Chapter name must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters"),
  classId: z.string().min(1, "Please select a class"),
  subjectId: z.string().min(1, "Please select a subject"),
  pdfUrl: z.string().min(1, "PDF file is required"),
})

type ChapterFormData = z.infer<typeof chapterSchema>

interface ChapterFormProps {
  chapterData?: any
  open: boolean
  onClose: () => void
}

export function ChapterForm({ chapterData, open, onClose }: ChapterFormProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string>("")

  const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation()
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation()
  const { data: classes = [], isLoading: classesLoading } = useGetClassesQuery()
  const { data: subjects = [], isLoading: subjectsLoading } = useGetSubjectsByClassQuery(
    { boardId: "", classId: selectedClassId },
    {
      skip: !selectedClassId,
    },
  )

  const isEditing = !!chapterData
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      slug: "",
      classId: "",
      subjectId: "",
      pdfUrl: "",
    },
  })

  const watchedName = watch("name")
  const watchedClassId = watch("classId")

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName)
      setValue("slug", slug)
    }
  }, [watchedName, setValue, isEditing])

  // Update selected class and reset subject when class changes
  useEffect(() => {
    if (watchedClassId !== selectedClassId) {
      setSelectedClassId(watchedClassId)
      if (!isEditing) {
        setValue("subjectId", "")
      }
    }
  }, [watchedClassId, selectedClassId, setValue, isEditing])

  // Reset form when chapterData changes
  useEffect(() => {
    if (chapterData) {
      reset({
        name: chapterData.name || "",
        slug: chapterData.slug || "",
        classId: chapterData.classId || "",
        subjectId: chapterData.subjectId || "",
        pdfUrl: chapterData.pdfUrl || "",
      })
      setSelectedClassId(chapterData.classId || "")
    } else {
      reset({
        name: "",
        slug: "",
        classId: "",
        subjectId: "",
        pdfUrl: "",
      })
      setSelectedClassId("")
    }
    setPdfFile(null)
  }, [chapterData, reset])

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Please select a valid PDF file")
    }
  }

  const removePdf = () => {
    setPdfFile(null)
    setValue("pdfUrl", "")
  }

  const uploadPdf = async (file: File): Promise<string> => {
    // Simulate file upload - replace with actual upload logic
    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)

    // Return a placeholder URL - replace with actual uploaded URL
    return `/placeholder.pdf?filename=${encodeURIComponent(file.name)}`
  }

  const onSubmit = async (data: ChapterFormData) => {
    try {
      let pdfUrl = data.pdfUrl

      // Upload PDF if a new file is selected
      if (pdfFile) {
        pdfUrl = await uploadPdf(pdfFile)
      }

      const chapterFormData = {
        ...data,
        pdfUrl,
      }

      if (isEditing) {
        await updateChapter({ id: chapterData.id, chapter: chapterFormData }).unwrap()
      } else {
        await createChapter(chapterFormData).unwrap()
      }

      onClose()
    } catch (error) {
      console.error("Failed to save chapter:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Chapter" : "Upload New Chapter"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the chapter information below."
              : "Upload a new PDF chapter to your educational system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* PDF File Upload */}
          <div className="space-y-2">
            <Label>Chapter PDF File *</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
              {pdfFile || (isEditing && watch("pdfUrl")) ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {pdfFile ? pdfFile.name : `${chapterData?.name || "Current"}.pdf`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF file uploaded"}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={removePdf} className="text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <div className="mb-2">
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                      <span className="text-slate-600"> or drag and drop</span>
                    </Label>
                  </div>
                  <p className="text-xs text-slate-500">PDF files only, up to 50MB</p>
                </div>
              )}
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
            </div>
            {errors.pdfUrl && <p className="text-sm text-red-600">{errors.pdfUrl.message}</p>}
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="classId">Class *</Label>
            <Select value={watch("classId")} onValueChange={(value) => setValue("classId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classesLoading ? (
                  <SelectItem value="" disabled>
                    Loading classes...
                  </SelectItem>
                ) : classes.length === 0 ? (
                  <SelectItem value="" disabled>
                    No classes available
                  </SelectItem>
                ) : (
                  classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.type.replace("_", " ")})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.classId && <p className="text-sm text-red-600">{errors.classId.message}</p>}
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label htmlFor="subjectId">Subject *</Label>
            <Select
              value={watch("subjectId")}
              onValueChange={(value) => setValue("subjectId", value)}
              disabled={!selectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedClassId ? "Select a subject" : "Select a class first"} />
              </SelectTrigger>
              <SelectContent>
                {subjectsLoading ? (
                  <SelectItem value="" disabled>
                    Loading subjects...
                  </SelectItem>
                ) : subjects.length === 0 ? (
                  <SelectItem value="" disabled>
                    No subjects available for this class
                  </SelectItem>
                ) : (
                  subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.subjectId && <p className="text-sm text-red-600">{errors.subjectId.message}</p>}
          </div>

          {/* Chapter Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Chapter Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Introduction to Algebra, Laws of Motion"
              {...register("name")}
              error={errors.name?.message}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Chapter Slug *</Label>
            <Input id="slug" placeholder="chapter-url-slug" {...register("slug")} error={errors.slug?.message} />
            {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
            <p className="text-xs text-slate-500">
              This will be used in URLs. Auto-generated from name but customizable.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isUploading ? "Uploading PDF..." : isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Chapter"
              ) : (
                "Upload Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
