import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  animationDelay?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  placeholder = "Select an option",
  icon: Icon,
  options,
  value,
  onValueChange,
  error,
  required = false,
  className = "",
  animationDelay = "0s",
}) => {
  return (
    <div
      className={`space-y-2 w-full animate-slide-in-right ${className}`}
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
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="transition-all duration-300 focus:shadow-md w-full border border-gray-300 min-h-10"
        >
          <SelectValue placeholder={placeholder} className="h-12" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;