import React from 'react';
import { Input } from "@/components/ui/input";

interface PaperInfoProps {
  board: string;
  classNumber: string;
  subject: string;
  paperName: string;
  examTime: string;
  totalMarks: number;
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
  onPaperNameChange,
  onExamTimeChange,
}) => {
  const formatBoardName = (boardSlug: string) => {
    return boardSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="text-center border-b pb-4 mb-6">
      <h1 className="text-xl font-bold uppercase mb-2">
        {formatBoardName(board)} BOARD OF INTERMEDIATE AND SECONDARY EDUCATION
      </h1>
      <Input
        type="text"
        value={paperName}
        onChange={(e) => onPaperNameChange(e.target.value)}
        className="text-center font-bold mb-2"
      />
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <p>Time:</p>
            <Input
              type="text"
              className="w-20 h-6 text-sm"
              value={examTime}
              onChange={(e) => onExamTimeChange(e.target.value)}
            />
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