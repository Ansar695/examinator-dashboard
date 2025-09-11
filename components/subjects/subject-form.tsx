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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useGetBoardsQuery,
  useGetClassesByBoardQuery,
} from "@/lib/api/educationApi"
import { generateSlug } from "@/lib/utils/slugify"

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required").max(100, "Subject name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters"),
  imageUrl: z.string().optional(),
  boardId: z.string().min(1, "Please select a board"),
  classId: z.string().min(1, "Please select a class"),
})

type SubjectFormData = z.infer<typeof subjectSchema>

interface SubjectFormProps {
  subjectData?: any
  open: boolean
  onClose: () => void
}

export function SubjectForm({ subjectData, open, onClose }: SubjectFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation()
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation()
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery()
  const { data: classes = [], isLoading: classesLoading } = useGetClassesByBoardQuery(selectedBoardId, {
    skip: !selectedBoardId,
  })

  const isEditing = !!subjectData
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      imageUrl: "",
      boardId: "",
      classId: "",
    },
  })

  const watchedName = watch("name")
  const watchedBoardId = watch("boardId")

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName)
      setValue("slug", slug)
    }
  }, [watchedName, setValue, isEditing])

  // Update selected board and reset class when board changes
  useEffect(() => {
    if (watchedBoardId !== selectedBoardId) {
      setSelectedBoardId(watchedBoardId)
      if (!isEditing) {
        setValue("classId", "")
      }
    }
  }, [watchedBoardId, selectedBoardId, setValue, isEditing])

  // Reset form when subjectData changes
  useEffect(() => {
    if (subjectData) {
      reset({
        name: subjectData.name || "",
        description: subjectData.description || "",
        slug: subjectData.slug || "",
        imageUrl: subjectData.imageUrl || "",
        boardId: subjectData.boardId || "",
        classId: subjectData.classId || "",
      })
      setSelectedBoardId(subjectData.boardId || "")
      setImagePreview(subjectData.imageUrl || "")
    } else {
      reset({
        name: "",
        description: "",
        slug: "",
        imageUrl: "",
        boardId: "",
        classId: "",
      })
      setSelectedBoardId("")
      setImagePreview("")
    }
    setImageFile(null)
  }, [subjectData, reset])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setValue("imageUrl", "")
  }

  const uploadImage = async (file: File): Promise<string> => {
    // Simulate file upload - replace with actual upload logic
    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsUploading(false)

    // Return a placeholder URL - replace with actual uploaded URL
    return `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(file.name)}`
  }

  const onSubmit = async (data: SubjectFormData) => {
    try {
      let imageUrl = data.imageUrl

      // Upload image if a new file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const subjectFormData = {
        ...data,
        imageUrl,
      }

      if (isEditing) {
        await updateSubject({ id: subjectData.id, subject: subjectFormData }).unwrap()
      } else {
        await createSubject(subjectFormData).unwrap()
      }

      onClose()
    } catch (error) {
      console.error("Failed to save subject:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Subject" : "Create New Subject"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the subject information below." : "Add a new subject to your educational system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject Image Upload */}
          <div className="space-y-2">
            <Label>Subject Image</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Subject image" />
                <AvatarFallback className="bg-slate-100">
                  <Upload className="h-6 w-6 text-slate-400" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Board Selection */}
          <div className="space-y-2">
            <Label htmlFor="boardId">Board *</Label>
            <Select value={watch("boardId")} onValueChange={(value) => setValue("boardId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {boardsLoading ? (
                  <SelectItem value="" disabled>
                    Loading boards...
                  </SelectItem>
                ) : boards.length === 0 ? (
                  <SelectItem value="" disabled>
                    No boards available
                  </SelectItem>
                ) : (
                  boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.boardId && <p className="text-sm text-red-600">{errors.boardId.message}</p>}
          </div>

          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="classId">Class *</Label>
            <Select
              value={watch("classId")}
              onValueChange={(value) => setValue("classId", value)}
              disabled={!selectedBoardId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedBoardId ? "Select a class" : "Select a board first"} />
              </SelectTrigger>
              <SelectContent>
                {classesLoading ? (
                  <SelectItem value="" disabled>
                    Loading classes...
                  </SelectItem>
                ) : classes.length === 0 ? (
                  <SelectItem value="" disabled>
                    No classes available for this board
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

          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Mathematics, Physics, English Literature"
              {...register("name")}
              error={errors.name?.message}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" placeholder="subject-url-slug" {...register("slug")} error={errors.slug?.message} />
            {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
            <p className="text-xs text-slate-500">
              This will be used in URLs. Auto-generated from name but customizable.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the subject..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isUploading ? "Uploading..." : isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Subject"
              ) : (
                "Create Subject"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
