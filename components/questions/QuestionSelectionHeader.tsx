// import React from 'react';
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft } from "lucide-react";

// interface QuestionSelectionHeaderProps {
//   board: string;
//   classNumber: string;
//   subject: string;
//   subjectId: string | null;
//   totalSelected: number;
//   isEditMode?: boolean;
//   paperId?: string | null;
// }

// export const QuestionSelectionHeader: React.FC<QuestionSelectionHeaderProps> = ({
//   board,
//   classNumber,
//   subject,
//   subjectId,
//   totalSelected,
//   isEditMode = false,
//   paperId,
// }) => {
//   const backUrl = isEditMode && paperId
//     ? `/${board}/${classNumber}/${subject}/view-paper?paperId=${paperId}&subjectId=${subjectId}`
//     : `/${board}/${classNumber}/${subject}/select-topics${subjectId ? `?subjectId=${subjectId}` : ''}`;
  
//   const backText = isEditMode ? 'Back to Paper Preview' : 'Back to Topic Selection';

//   return (
//     <div className="mb-8 flex justify-between items-center">
//       <Link href={backUrl}>
//         <Button
//           variant="ghost"
//           className="flex items-center text-blue-600 hover:text-blue-800"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           {backText}
//         </Button>
//       </Link>
//       <Badge variant="outline" className="text-lg px-3 py-1">
//         Selected: {totalSelected}
//       </Badge>
//     </div>
//   );
// };

import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface QuestionSelectionHeaderProps {
  board: string;
  classNumber: string;
  subject: string;
  totalSelected: number;
  isEditMode?: boolean;
  paperId?: string | null;
}

export const QuestionSelectionHeader: React.FC<QuestionSelectionHeaderProps> = ({
  board,
  classNumber,
  subject,
  isEditMode = false,
  paperId,
}) => {
  const backUrl = isEditMode && paperId
    ? `/${board}/${classNumber}/${subject}/view-paper?paperId=${paperId}`
    : `/${board}/${classNumber}/${subject}/select-topics`;
  
  const backText = isEditMode ? 'Back' : 'Back';

  return (
    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
      <Link href={backUrl}>
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer bg-gray-200 px-10 py-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {backText}
        </Button>
      </Link>
      
      <div className="text-md font-medium text-gray-600 capitalize">
        {board?.replace("-", " ")} • Class {classNumber}
      </div>
    </div>
  );
};
