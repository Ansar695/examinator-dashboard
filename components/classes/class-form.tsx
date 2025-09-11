"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateClassMutation,
  useUpdateClassMutation,
  useGetBoardsQuery,
} from "@/lib/api/educationApi";
import { generateSlug } from "@/lib/utils/slugify";

const classSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .max(100, "Class name must be less than 100 characters"),
  type: z.enum(
    [
      "PRIMARY",
      "SECONDARY",
      "HIGHER_SECONDARY",
      "INTERMEDIATE",
    ],
    {
      required_error: "Please select a class type",
    }
  ),
  boardId: z.string().min(1, "Please select a board"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  classData?: any;
  open: boolean;
  onClose: () => void;
}

const classTypes = [
  { value: "PRIMARY", label: "Primary" },
  { value: "SECONDARY", label: "Secondary" },
  { value: "HIGHER_SECONDARY", label: "Higher Secondary" },
  { value: "INTERMEDIATE", label: "Intermediate" },
];

export function ClassForm({ classData, open, onClose }: ClassFormProps) {
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();

  const isEditing = !!classData;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      type: undefined,
      boardId: "",
      slug: "",
    },
  });

  const watchedName = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName);
      setValue("slug", slug);
    }
  }, [watchedName, setValue, isEditing]);

  // Reset form when classData changes
  useEffect(() => {
    if (classData) {
      reset({
        name: classData.name || "",
        type: classData.type || undefined,
        boardId: classData.boardId || "",
        slug: classData.slug || "",
      });
    } else {
      reset({
        name: "",
        type: undefined,
        boardId: "",
        slug: "",
      });
    }
  }, [classData, reset]);

  const onSubmit = async (data: ClassFormData) => {
    try {
      if (isEditing) {
        await updateClass({ id: classData.id, class: data }).unwrap();
      } else {
        await createClass(data).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save class:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Class" : "Create New Class"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the class information below."
              : "Add a new class to your educational system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Board Selection */}
          <div className="space-y-2">
            <Label htmlFor="boardId">Board *</Label>
            <Select
              value={watch("boardId")}
              onValueChange={(value) => setValue("boardId", value)}
            >
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
            {errors.boardId && (
              <p className="text-sm text-red-600">{errors.boardId.message}</p>
            )}
          </div>

          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Class 10, Grade 12, Bachelor of Science"
              {...register("name")}
              onChange={(e) => setValue("name", e.target.value)}
              error={errors.name?.message}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Class Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Class Type *</Label>
            <Select
              value={watch("type")}
              onValueChange={(value) => setValue("type", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="class-url-slug"
              {...register("slug")}
              onChange={(e) => setValue("slug", generateSlug(e.target.value))}
              error={errors.slug?.message}
            />
            {errors.slug && (
              <p className="text-sm text-red-600">{errors.slug.message}</p>
            )}
            <p className="text-xs text-slate-500">
              This will be used in URLs. Auto-generated from name but
              customizable.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Class"
              ) : (
                "Create Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
