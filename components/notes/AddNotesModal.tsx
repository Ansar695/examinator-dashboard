// Updated NotesModal.tsx using react-hook-form and zod

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Upload } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { FileUpload, SelectInput, TextInput } from "../common/form";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import {
  useGetBoardsQuery,
  useGetClassesByBoardQuery,
} from "@/lib/api/educationApi";
import SelectClass from "../common/SelectClass";
import SelectBoard from "../common/SelectBoard";
import { userTypeOptions } from "@/utils/static/userTypes";
import { addNotesSchema } from "@/utils/schemas/notesSchema";
import {
  Note,
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/lib/api/notesApi";
import CustomSpinner from "../shared/CustomSpinner";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNote?: Note | null;
  refetchNotes: () => void;
}

export default function NotesModal({
  isOpen,
  onClose,
  editingNote,
  refetchNotes,
}: NotesModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [allBoards, setAllBoards] = useState<any>([]);
  const [fileSize, setFileSize] = useState<number>(0);

  const [createNote, { isLoading, error }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating, error: updateError }] =
    useUpdateNoteMutation();

  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();
  const { data: classes = [], isLoading: classesLoading } =
    useGetClassesByBoardQuery(selectedBoardId, {
      skip: !selectedBoardId,
    });

  const loading = isLoading || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addNotesSchema>>({
    resolver: zodResolver(addNotesSchema),
  });
  const watchedBoardId = watch("boardId");
  const file = watch("file");

  useEffect(() => {
    if (boards?.length > 0) {
      setAllBoards(boards);
    }
  }, [boards]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileSizeInBytes = file ? file.size : 0;
    setFileSize(fileSizeInBytes);
    if (file) {
      try {
        setIsFileUploading(true);

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const fileUploaded = await uploadToCloudinary(file);
        setValue("file", fileUploaded as string);

        toast({
          title: "Profile picture uploaded",
          description: "file uploaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
        setPreview(null);
      } finally {
        setIsFileUploading(false);
      }
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof addNotesSchema>) => {
    try {
      const role = data.userType === "student" ? "STUDENT" : "TEACHER";
      if (editingNote) {
        await updateNote!({
          id: editingNote?.id,
          payload: {
            notesTitle: data.title,
            boardId: data.boardId,
            classId: data.classId,
            file: data.file,
            userType: role,
            fileSize: fileSize,
          },
        });
        toast({
          title: "Success!",
          description: "Note Updated Successful.",
        });
      } else {
        await createNote({
          notesTitle: data.title,
          boardId: data.boardId,
          classId: data.classId,
          file: data.file,
          userType: role,
          fileSize: fileSize,
        });
        toast({
          title: "Success!",
          description: "Note added Successful.",
        });
        refetchNotes();
      }

      onClose()
    } catch (error: any) {
      toast({
        title: "Note Add Failed",
        description:
          error?.data?.error ||
          error?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    if (watchedBoardId) {
      setSelectedBoardId(watchedBoardId);
    }
  }, [watchedBoardId]);

  useEffect(() => {
    if (editingNote) {
      setValue("title", editingNote?.notesTitle);
      setValue("boardId", editingNote?.boardId);
      setValue("classId", editingNote?.classId);
      setValue("userType", editingNote?.userType.toLowerCase() as any);
      setValue("file", editingNote?.file || "");
      setPreview(editingNote?.file || null);
      setFileSize(editingNote?.fileSize || 0);
    }
  }, [editingNote]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Toaster />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>
            Upload a PDF file for lecture or exam preparation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <TextInput
            id="title"
            label="Note Title"
            placeholder="e.g., Chemistry Notes - Chapter 5"
            value={watch("title") || ""}
            setValue={setValue}
            error={errors.title?.message}
            required
          />

          <SelectBoard
            allBoards={allBoards}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          <SelectClass
            classes={classes}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          <SelectInput
            id="userType"
            label="User Type"
            placeholder="Select user type"
            icon={GraduationCap}
            options={userTypeOptions}
            value={watch("userType") || ""}
            onValueChange={(value) =>
              setValue("userType", value as "student" | "teacher" | "other")
            }
            error={errors.userType?.message}
            required={true}
            animationDelay="0.4s"
          />

          {isFileUploading ? (
            <CustomSpinner />
          ) : (
            <FileUpload
              id="pdf-upload"
              label="PDF File"
              accept="application/pdf"
              preview={preview}
              onChange={handleFileChange}
              required
              description="Upload lecture notes or study materials"
              maxSize="25MB"
            />
          )}
          {errors.file && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {errors.file.message}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !file}
              className="flex-1 relative"
            >
              {loading ? (
                <span className="absolute left-1/2 -translate-x-1/2">
                  Uploading...
                </span>
              ) : (
                <>
                  {editingNote ? (
                    "Update Note"
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" /> Upload Note
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
