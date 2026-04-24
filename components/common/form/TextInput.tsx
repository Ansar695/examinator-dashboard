import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextInputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "tel";
  icon?: LucideIcon;
  setValue: any;
  value: any;
  error?: string;
  required?: boolean;
  className?: string;
  animationDelay?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  error,
  setValue,
  value,
  required = false,
  className = "",
  animationDelay = "0s",
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}) => {
  return (
    <div
      className={`space-y-2 animate-slide-in-right ${className}`}
      style={{ animationDelay }}
    >
      <Label
        htmlFor={id}
        className="text-sm font-medium flex items-center gap-2"
      >
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
        {!required && <span className="text-muted-foreground">(Optional)</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPasswordToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          className={`transition-all duration-300 focus:shadow-md border border-gray-300 h-10 ${
            showPasswordToggle ? "pr-10" : ""
          }`}
          onChange={(e) => setValue(id, e.target.value)}
          value={value}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default TextInput;