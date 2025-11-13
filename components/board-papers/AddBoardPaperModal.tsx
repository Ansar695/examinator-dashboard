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
import {
  Note,
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from "@/lib/api/notesApi";
import CustomSpinner from "../shared/CustomSpinner";
import {
  BoardPaper,
  useCreateBoardPaperMutation,
  useUpdateBoardPaperMutation,
} from "@/lib/api/boardPapersApi";
import { boardPaperaSchema } from "@/utils/schemas/boardPapersSchema";
import { boardYears } from "@/utils/static/boardYears";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBoardPaper?: BoardPaper | null;
  refetchBoardPapers: () => void;
}

export default function AddBoardPaperModal({
  isOpen,
  onClose,
  editingBoardPaper,
  refetchBoardPapers,
}: NotesModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileSize, setFileSize] = useState<number>(0);

  const [createBoardPaper, { isLoading, error }] =
    useCreateBoardPaperMutation();
  const [updateBoardPaper, { isLoading: isUpdating, error: updateError }] =
    useUpdateBoardPaperMutation();

  const loading = isLoading || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof boardPaperaSchema>>({
    resolver: zodResolver(boardPaperaSchema),
  });
  const file = watch("paperFile");

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
        setValue("paperFile", fileUploaded as string);

        toast({
          title: "Paper file uploaded",
          description: "Paper file uploaded successfully.",
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

  const handleFormSubmit = async (data: z.infer<typeof boardPaperaSchema>) => {
    try {
      if (editingBoardPaper) {
        await updateBoardPaper!({
          id: editingBoardPaper?.id,
          payload: {
            boardName: data.boardName,
            paperFile: data.paperFile,
            boardYear: data?.boardYear,
            fileSize: fileSize,
          },
        });
        toast({
          title: "Success!",
          description: "Note Updated Successful.",
        });
      } else {
        await createBoardPaper({
          boardName: data.boardName,
          paperFile: data.paperFile,
          boardYear: data?.boardYear,
          fileSize: fileSize,
        });
        toast({
          title: "Success!",
          description: "Board paper added Successfully.",
        });
        refetchBoardPapers();
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Board Paper Add Failed",
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
    if (editingBoardPaper) {
      setValue("boardName", editingBoardPaper?.boardName);
      setValue("boardYear", editingBoardPaper?.boardYear);
      setValue("paperFile", editingBoardPaper?.paperFile);
      setPreview(editingBoardPaper?.paperFile || null);
      setFileSize(editingBoardPaper?.fileSize || 0);
    }
  }, [editingBoardPaper]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Toaster />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Board Paper</DialogTitle>
          <DialogDescription>
            Upload a PDF file of board paper
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <TextInput
            id="boardName"
            label="Board Name"
            placeholder="e.g., Lahore Board, Sargodha Board"
            value={watch("boardName") || ""}
            setValue={setValue}
            error={errors.boardName?.message}
            required
          />

          <SelectInput
            id="boardYear"
            label="Year"
            placeholder="Select Year"
            icon={GraduationCap}
            options={boardYears}
            value={watch("boardYear") || ""}
            onValueChange={(value) =>
              setValue("boardYear", value)
            }
            error={errors.boardYear?.message}
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
          {errors.paperFile && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {errors.paperFile.message}
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
                  {editingBoardPaper ? (
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
