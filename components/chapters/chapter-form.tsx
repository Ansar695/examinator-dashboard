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
import { Label } from "@/components/ui/label";
import {
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useGetClassesQuery,
  useGetSubjectsByClassQuery,
} from "@/lib/api/educationApi";
import { generateSlug } from "@/lib/utils/slugify";
import SelectClass from "../common/SelectClass";
import SelectSubject from "../common/SelectSubject";
import { CloudinaryUpload } from "../ui/cloudinary-upload";
import { EMBEDDINGS_BASE_URL } from "@/config";
import { toast } from "../ui/use-toast";
import { useToast } from "../common/CustomToast";

const chapterSchema = z.object({
  name: z
    .string()
    .min(1, "Chapter name is required")
    .max(100, "Chapter name must be less than 100 characters"),
  chapterNumber: z.number(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  classId: z.string().min(1, "Please select a class"),
  subjectId: z.string().min(1, "Please select a subject"),
  pdfUrl: z.string().min(1, "PDF file is required"),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

interface ChapterFormProps {
  chapterData?: any;
  open: boolean;
  onClose: () => void;
}

export function ChapterForm({ chapterData, open, onClose }: ChapterFormProps) {
  const { showSuccess, showError, ToastComponent } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const[embeddingsLoader, setEmbeddingLoader] = useState(false)

  const [createChapter, { isLoading: isCreating }] = useCreateChapterMutation();
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();
  const { data: classes, isLoading: classesLoading } = useGetClassesQuery();
  const { data: subjects, isLoading: subjectsLoading } =
    useGetSubjectsByClassQuery(
      { boardId: "", classId: selectedClassId },
      {
        skip: !selectedClassId,
      }
    );

  const isEditing = !!chapterData;
  const isLoading = isCreating || isUpdating;

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
  });

  const watchedName = watch("name");
  const watchedClassId = watch("classId");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !isEditing) {
      const slug = generateSlug(watchedName);
      setValue("slug", slug);
    }
  }, [watchedName, setValue, isEditing]);

  // Update selected class and reset subject when class changes
  useEffect(() => {
    if (watchedClassId !== selectedClassId) {
      setSelectedClassId(watchedClassId);
      if (!isEditing) {
        setValue("subjectId", "");
      }
    }
  }, [watchedClassId, selectedClassId, setValue, isEditing]);

  // Reset form when chapterData changes
  useEffect(() => {
    if (chapterData) {
      reset({
        name: chapterData.name || "",
        slug: chapterData.slug || "",
        classId: chapterData.classId || "",
        subjectId: chapterData.subjectId || "",
        pdfUrl: chapterData.pdfUrl || "",
      });
      setSelectedClassId(chapterData.classId || "");
    } else {
      reset({
        name: "",
        slug: "",
        classId: "",
        subjectId: "",
        pdfUrl: "",
      });
      setSelectedClassId("");
    }
    setPdfFile(null);
  }, [chapterData, reset]);

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setValue("pdfUrl", "");
  };

  const uploadPdf = async (file: File): Promise<string> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset"
      );
      formData.append("resource_type", "raw"); // Important: use 'raw' for PDF files

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload PDF to Cloudinary");
      }

      const data = await response.json();
      setIsUploading(false);

      return data.secure_url;
    } catch (error) {
      setIsUploading(false);
      console.error("PDF upload error:", error);
      throw new Error("Failed to upload PDF. Please try again.");
    }
  };

  const uploadChapterForEmbeddings = async (
    data: any,
    chapterFormData: any
  ) => {
    try {
      const selectedClass = classes?.find((c) => c.id === data.classId);
      const formData = new FormData();
      formData.append("subject", data?.name);
      formData.append("book", selectedClass?.name as string);
      formData.append("chapter", data?.name);
      formData.append("pdf_url", data?.pdfUrl);
      setEmbeddingLoader(true)
      const embeddingsResponse = await fetch(
        `${EMBEDDINGS_BASE_URL}/admin/upload_chapter`,
        {
          method: "POST",
          body: formData,
        }
      );
setEmbeddingLoader(false)
      const parsedResp = await embeddingsResponse.json();
      if (!embeddingsResponse?.ok) {
        showError(parsedResp?.details ?? "Failed to create embeddings.");
      } else {
        if (parsedResp.success) {
          showSuccess("Embeddings created successfully, uploading embeddings");
        }
        await createChapter(chapterFormData).unwrap();
      }
    } catch (error) {
      console.log("error");
      setEmbeddingLoader(false)
      return error;
    }
  };

  const onSubmit = async (data: ChapterFormData) => {
    try {
      let pdfUrl = data.pdfUrl;

      // Upload PDF if a new file is selected
      if (pdfFile) {
        pdfUrl = await uploadPdf(pdfFile);
      }

      const chapterFormData = {
        ...data,
        pdfUrl,
      };

      if (isEditing) {
        await updateChapter({
          id: chapterData.id,
          chapter: chapterFormData,
        }).unwrap();
      } else {
        await uploadChapterForEmbeddings(data, chapterFormData);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save chapter:", error);
    }
  };

  const handleLogoUpload = (url: string) => {
    setValue("pdfUrl", url);
  };

  const handleLogoRemove = () => {
    setValue("pdfUrl", "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Chapter" : "Upload New Chapter"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the chapter information below."
              : "Upload a new PDF chapter to your educational system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <CloudinaryUpload
                variant="avatar"
                accept="all"
                label="Subject Image"
                currentUrl={watch("pdfUrl")}
                onUpload={handleLogoUpload}
                onRemove={handleLogoRemove}
                error={errors.pdfUrl?.message}
                maxSize={20}
              />
            </div>
          </div>

          {/* Class Selection */}
          <SelectClass
            classes={classes || []}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {/* Subject Selection */}
          <SelectSubject
            subjects={subjects || []}
            watch={watch}
            setValue={setValue}
            errors={errors}
            selectedClassId={selectedClassId || null}
          />

          {/* Chapter Number */}
          <div className="space-y-2">
            <Label htmlFor="name">Chapter Number *</Label>
            <Input
              id="chapterNumber"
              placeholder="e.g., Introduction to Algebra, Laws of Motion"
              {...register("chapterNumber")}
              type="number"
              onChange={(e) =>
                setValue("chapterNumber", parseInt(e.target.value))
              }
              className="border border-gray-300"
            />
            {errors.name && (
              <p
                className="text-sm t
              ext-red-600"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Chapter Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Chapter Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Introduction to Algebra, Laws of Motion"
              {...register("name")}
              onChange={(e) => setValue("name", e.target.value)}
              className="border border-gray-300"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Chapter Slug *</Label>
            <Input
              id="slug"
              placeholder="chapter-url-slug"
              {...register("slug")}
              onChange={(e) => setValue("slug", e.target.value)}
              className="border border-gray-300"
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
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading || embeddingsLoader ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isUploading
                    ? "Uploading PDF..."
                    : isEditing
                    ? "Updating..."
                    : "Creating..."}
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
      {ToastComponent}
    </Dialog>
  );
}
