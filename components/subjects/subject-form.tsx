"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useGetBoardsQuery,
  useGetClassesByBoardQuery,
} from "@/lib/api/educationApi";
import { generateSlug } from "@/lib/utils/slugify";
import { CloudinaryUpload } from "../ui/cloudinary-upload";
import SelectBoard from "../common/SelectBoard";
import SelectClass from "../common/SelectClass";

const subjectSchema = z.object({
  name: z
    .string()
    .min(1, "Subject name is required")
    .max(100, "Subject name must be less than 100 characters"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  imageUrl: z.string().optional(),
  boardId: z.string().min(1, "Please select a board"),
  classId: z.string().min(1, "Please select a class"),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subjectData?: any;
  open: boolean;
  onClose: () => void;
}

export function SubjectForm({ subjectData, open, onClose }: SubjectFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: classes = [], isLoading: classesLoading } =
    useGetClassesByBoardQuery(selectedBoardId, {
      skip: !selectedBoardId,
    });
  console.log("boards", boards);
  const isEditing = !!subjectData;
  const isLoading = isCreating || isUpdating;
  const [allBoards, setAllBoards] = useState<any>([]);

  useEffect(() => {
    if (boards) {
      setAllBoards(boards);
    }
  }, [boards]);

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
  });

  const watchedName = watch("name");
  const watchedBoardId = watch("boardId");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName);
      setValue("slug", slug);
    }
  }, [watchedName, setValue, isEditing]);

  // Update selected board and reset class when board changes
  useEffect(() => {
    if (watchedBoardId !== selectedBoardId) {
      setSelectedBoardId(watchedBoardId);
      if (!isEditing) {
        setValue("classId", "");
      }
    }
  }, [watchedBoardId, selectedBoardId, setValue, isEditing]);

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
      });
      setSelectedBoardId(subjectData.boardId || "");
      setImagePreview(subjectData.imageUrl || "");
    } else {
      reset({
        name: "",
        description: "",
        slug: "",
        imageUrl: "",
        boardId: "",
        classId: "",
      });
      setSelectedBoardId("");
      setImagePreview("");
    }
    setImageFile(null);
  }, [subjectData, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setValue("imageUrl", "");
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Simulate file upload - replace with actual upload logic
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsUploading(false);

    // Return a placeholder URL - replace with actual uploaded URL
    return `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(
      file.name
    )}`;
  };

  const onSubmit = async (data: SubjectFormData) => {
    try {
      let imageUrl = data.imageUrl;

      // Upload image if a new file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const subjectFormData = {
        ...data,
        imageUrl,
      };

      if (isEditing) {
        await updateSubject({
          id: subjectData.id,
          subject: subjectFormData,
        }).unwrap();
      } else {
        await createSubject(subjectFormData).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Failed to save subject:", error);
    }
  };

  const handleLogoUpload = (url: string) => {
    setValue("imageUrl", url);
  };

  const handleLogoRemove = () => {
    setValue("imageUrl", "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Subject" : "Create New Subject"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the subject information below."
              : "Add a new subject to your educational system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject Image Upload */}
          <div className="space-y-2">
            {/* <Label>Subject Image</Label> */}
            <div className="flex items-center gap-4">
              <CloudinaryUpload
                variant="avatar"
                accept="image"
                label="Subject Image"
                currentUrl={watch("imageUrl")}
                onUpload={handleLogoUpload}
                onRemove={handleLogoRemove}
                error={errors.imageUrl?.message}
                maxSize={5}
              />
            </div>
          </div>

          {/* Board Selection */}
          <SelectBoard 
            allBoards={allBoards}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="classId">Class *</Label>
            <Select
              value={watch("classId")}
              onValueChange={(value) => setValue("classId", value)}
              disabled={!selectedBoardId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedBoardId ? "Select a class" : "Select a board first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {classes?.length > 0 &&
                  classes?.map((classItem) => (
                    <SelectItem key={classItem?.id} value={classItem?.id}>
                      {classItem?.name}{" "}
                      {/* ({classItem.type.replace("_", " ")}) */}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.classId && (
              <p className="text-sm text-red-600">{errors.classId.message}</p>
            )}
          </div>
          <SelectClass 
            classes={classes}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Mathematics, Physics, English Literature"
              {...register("name")}
              onChange={(e) => setValue("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="subject-url-slug"
              {...register("slug")}
              onChange={(e) => setValue("slug", e.target.value)}
            />
            {errors.slug && (
              <p className="text-sm text-red-600">{errors.slug.message}</p>
            )}
            <p className="text-xs text-slate-500">
              This will be used in URLs. Auto-generated from name but
              customizable.
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
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isUploading
                    ? "Uploading..."
                    : isEditing
                    ? "Updating..."
                    : "Creating..."}
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
  );
}
