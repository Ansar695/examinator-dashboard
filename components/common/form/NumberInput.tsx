import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

interface NumberInputProps {
  id: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  setValue: any;
  value: number;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  animationDelay?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  placeholder,
  icon: Icon,
  value,
  setValue,
  error,
  required = false,
  min,
  max,
  step = 1,
  className = "",
  animationDelay = "0s",
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
      <Input
        id={id}
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="transition-all duration-300 focus:shadow-md border border-gray-300 h-10"
        value={value}
        onChange={(e) => setValue(id, parseInt(e.target.value))}
      />
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default NumberInput;
