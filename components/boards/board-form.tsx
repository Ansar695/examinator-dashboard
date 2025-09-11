"use client"
import { useEffect } from "react"
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
import { Loader2 } from "lucide-react"
import { useCreateBoardMutation, useUpdateBoardMutation } from "@/lib/api/educationApi"
import { generateSlug } from "@/lib/utils/slugify"
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload"

const boardSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  logoUrl: z.string().optional(),
})

type BoardFormData = z.infer<typeof boardSchema>

interface BoardFormProps {
  board?: any
  open: boolean
  onClose: () => void
}

export function BoardForm({ board, open, onClose }: BoardFormProps) {
  const [createBoard, { isLoading: isCreating }] = useCreateBoardMutation()
  const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation()

  const isEditing = !!board
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      logoUrl: "",
    },
  })

  const watchedName = watch("name")

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName)
      setValue("slug", slug)
    }
  }, [watchedName, setValue, isEditing])

  // Reset form when board changes
  useEffect(() => {
    if (board) {
      reset({
        name: board.name || "",
        description: board.description || "",
        slug: board.slug || "",
        logoUrl: board.logoUrl || "",
      })
    } else {
      reset({
        name: "",
        description: "",
        slug: "",
        logoUrl: "",
      })
    }
  }, [board, reset])

  const handleLogoUpload = (url: string) => {
    setValue("logoUrl", url)
  }

  const handleLogoRemove = () => {
    setValue("logoUrl", "")
  }

  const onSubmit = async (data: BoardFormData) => {
    try {
      if (isEditing) {
        await updateBoard({ id: board.id, board: data }).unwrap()
      } else {
        await createBoard(data).unwrap()
      }
      onClose()
    } catch (error) {
      console.error("Failed to save board:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Board" : "Create New Board"}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing ? "Update the board information below." : "Add a new educational board to your system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CloudinaryUpload
            variant="avatar"
            accept="image"
            label="Board Logo"
            currentUrl={watch("logoUrl")}
            onUpload={handleLogoUpload}
            onRemove={handleLogoRemove}
            error={errors.logoUrl?.message}
            maxSize={5}
          />

          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold">
              Board Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., CBSE, ICSE, State Board"
              {...register("name")}
              onChange={(e) => setValue("name", e.target.value)}
              className={errors.name ? "border-destructive focus:ring-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="slug" className="text-sm font-semibold">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="board-url-slug"
              {...register("slug")}
              onChange={(e) => setValue("slug", generateSlug(e.target.value))}
              className={errors.slug ? "border-destructive focus:ring-destructive" : ""}
            />
            {errors.slug && <p className="text-sm text-destructive font-medium">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground">
              This will be used in URLs. Auto-generated from name but customizable.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the educational board..."
              rows={3}
              {...register("description")}
              className="resize-none"
            />
            {errors.description && <p className="text-sm text-destructive font-medium">{errors.description.message}</p>}
          </div>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Board"
              ) : (
                "Create Board"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
