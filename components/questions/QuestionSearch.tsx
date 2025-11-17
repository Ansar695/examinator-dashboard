import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QuestionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const QuestionSearch: React.FC<QuestionSearchProps> = ({
  value,
  onChange,
  placeholder = "Search questions...",
}) => {
  return (
    <div className="relative mb-6 w-[50%]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};