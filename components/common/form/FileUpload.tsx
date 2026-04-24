import React from "react";
import { Label } from "@/components/ui/label";
import { Upload, LucideIcon } from "lucide-react";

interface FileUploadProps {
  id: string;
  label: string;
  accept?: string;
  preview?: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  animationDelay?: string;
  // For profile picture style
  isProfilePicture?: boolean;
  profileIcon?: LucideIcon;
  // For logo/document style
  description?: string;
  maxSize?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  accept = "image/*",
  preview,
  onChange,
  error,
  required = false,
  className = "",
  animationDelay = "0s",
  isProfilePicture = false,
  profileIcon: ProfileIcon,
  description,
  maxSize = "5MB",
}) => {
  if (isProfilePicture) {
    return (
      <div
        className={`flex justify-center mb-6 animate-fade-in ${className}`}
        style={{ animationDelay }}
      >
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              ProfileIcon && <ProfileIcon className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <label
            htmlFor={id}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-3 cursor-pointer shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          >
            <Upload className="w-4 h-4" />
          </label>
          <input
            id={id}
            type="file"
            accept={accept}
            className="hidden"
            onChange={onChange}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive animate-fade-in mt-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`space-y-2 animate-fade-in ${className}`}
      style={{ animationDelay }}
    >
      <Label className="text-sm font-medium mb-2 block">
        {label}
        {!required && <span className="text-muted-foreground ml-2">(Optional)</span>}
      </Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onChange}
        />
        <label htmlFor={id} className="cursor-pointer">
          {preview ? (
            <div className="flex flex-col items-center">
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 object-contain mb-2 rounded"
              />
              <p className="text-sm text-muted-foreground">
                Click to change {label.toLowerCase()}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">Upload {label}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {accept.includes("image") ? "PNG, JPG" : "Supported formats"} up to {maxSize}
              </p>
            </div>
          )}
        </label>
      </div>
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;