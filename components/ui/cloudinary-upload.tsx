"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, X, FileText, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface CloudinaryUploadProps {
  onUpload: (url: string) => void
  onRemove?: () => void
  accept?: "image" | "pdf" | "all"
  maxSize?: number // in MB
  currentUrl?: string
  currentFileName?: string
  label?: string
  required?: boolean
  error?: string
  className?: string
  variant?: "avatar" | "dropzone" | "button";
}

export function CloudinaryUpload({
  onUpload,
  onRemove,
  accept = "all",
  maxSize = 50,
  currentUrl,
  currentFileName,
  label,
  required = false,
  error,
  className,
  variant = "dropzone",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const getAcceptString = () => {
    switch (accept) {
      case "image":
        return "image/*"
      case "pdf":
        return ".pdf,application/pdf"
      default:
        return "image/*,.pdf,application/pdf"
    }
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    if (accept === "image" && !file.type.startsWith("image/")) {
      return "Only image files are allowed"
    }
    if (accept === "pdf" && file.type !== "application/pdf") {
      return "Only PDF files are allowed"
    }

    return null
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Upload failed")
    }

    const data = await response.json()
    return data.url
  }

  const handleFileUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        alert(validationError)
        return
      }

      setIsUploading(true)
      try {
        const url = await uploadToCloudinary(file)
        onUpload(url)
      } catch (error) {
        console.error("Upload error:", error)
        alert("Upload failed. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, accept, maxSize],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes("image/")
  }

  const isPdf = (url: string) => {
    return /\.pdf$/i.test(url) || url.includes("application/pdf")
  }

  if (variant === "avatar") {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={currentUrl || "/placeholder.svg"} alt="Upload preview" />
            <AvatarFallback className="bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept={getAcceptString()}
              onChange={handleFileChange}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors disabled:opacity-50"
            />
            {currentUrl && onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              >
                <X className="mr-1 h-3 w-3" />
                Remove
              </Button>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      </div>
    )
  }

  if (variant === "button") {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-semibold">
            {label} {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isUploading ? "Uploading..." : "Choose File"}
          </Button>
          {currentUrl && <span className="text-sm text-muted-foreground">{currentFileName || "File uploaded"}</span>}
          {currentUrl && onRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          accept={getAcceptString()}
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      </div>
    )
  }

  // Default dropzone variant
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-semibold">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          error ? "border-destructive" : "",
          isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("dropzone-input")?.click()}
      >
        {currentUrl ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {isImage(currentUrl) ? (
                <ImageIcon className="h-6 w-6 text-primary" />
              ) : isPdf(currentUrl) ? (
                <FileText className="h-6 w-6 text-red-600" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {currentFileName || (isPdf(currentUrl) ? "PDF File" : "Image File")}
              </p>
              <p className="text-xs text-muted-foreground">File uploaded successfully</p>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <div className="mb-2">
                  <span className="text-primary hover:text-primary/80 font-medium">Click to upload</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {accept === "image" && "Images only, "}
                  {accept === "pdf" && "PDF files only, "}
                  up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
      <input
        id="dropzone-input"
        type="file"
        accept={getAcceptString()}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  )
}
