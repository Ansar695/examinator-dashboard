import React from 'react';
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaperInfoProps {
  board: string;
  classNumber: string;
  subject: string;
  paperName: string;
  examTime: string;
  totalMarks: number;
  institutionLogo?: string | null;
  institutionName?: string | null;
  isPreview?: boolean;
  onPaperNameChange: (value: string) => void;
  onExamTimeChange: (value: string) => void;
}

export const PaperInfo: React.FC<PaperInfoProps> = ({
  board,
  classNumber,
  subject,
  paperName,
  examTime,
  totalMarks,
  institutionLogo,
  institutionName,
  isPreview = false,
  onPaperNameChange,
  onExamTimeChange,
}) => {
  const formatBoardName = (boardSlug: string) => {
    return boardSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            {institutionLogo ? (
              <Image
                src={institutionLogo}
                alt={institutionName || "Institution"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <GraduationCap className="h-6 w-6 text-slate-500" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700">
              {institutionName || "Your Institution"}
            </p>
            <p className="text-xs text-slate-500">
              {formatBoardName(board)} Board
            </p>
          </div>
        </div>
        <h1 className="text-xl font-bold uppercase">
          {formatBoardName(board)} BOARD OF INTERMEDIATE AND SECONDARY EDUCATION
        </h1>
      </div>
      {isPreview ? (
        <h2 className="text-center font-bold mb-2">{paperName}</h2>
      ) : (
        <Input
          type="text"
          value={paperName}
          onChange={(e) => onPaperNameChange(e.target.value)}
          className="text-center font-bold mb-2"
        />
      )}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <p>Time:</p>
            {isPreview ? (
              <span className="min-w-20 border-b border-dotted border-gray-400 px-1 text-sm">
                {examTime}
              </span>
            ) : (
              <Input
                type="text"
                className="w-20 h-6 text-sm"
                value={examTime}
                onChange={(e) => onExamTimeChange(e.target.value)}
              />
            )}
            <p>Hours</p>
          </div>
          <p>Class: {classNumber}</p>
        </div>
        <div className="text-right">
          <p>Total Marks: {totalMarks}</p>
          <p>Subject: {subject}</p>
        </div>
      </div>
    </div>
  );
};
