import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface QuestionSelectionHeaderProps {
  board: string;
  classNumber: string;
  subject: string;
  subjectId: string | null;
  totalSelected: number;
}

export const QuestionSelectionHeader: React.FC<QuestionSelectionHeaderProps> = ({
  board,
  classNumber,
  subject,
  subjectId,
  totalSelected,
}) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <Link href={`/${board}/${classNumber}/${subject}/select-topics${subjectId ? `?subjectId=${subjectId}` : ''}`}>
        <Button
          variant="ghost"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topic Selection
        </Button>
      </Link>
      <Badge variant="outline" className="text-lg px-3 py-1">
        Selected: {totalSelected}
      </Badge>
    </div>
  );
};