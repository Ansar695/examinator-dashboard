import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Eye, Save, Loader2, BookTemplate } from 'lucide-react';
import { TemplatesModal } from '../paper-templates/TemplatesModal';

interface PaperHeaderProps {
  board: string;
  classNumber: string;
  subject: string;
  subjectId: string | null;
  hasChanges: boolean;
  isUpdating: boolean;
  onSaveChanges: () => void;
  onEdit: () => void;
  onPreview: () => void;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({
  board,
  classNumber,
  subject,
  subjectId,
  hasChanges,
  isUpdating,
  onSaveChanges,
  onEdit,
  onPreview,
}) => {
  const[showTemplatesModal, setShowTemplatesModal] = useState(false);
  return (
    <div className="p-6 bg-gray-100 border-b space-y-4">
      <div className="flex justify-between items-center">
        <Link href={`/${board}/${classNumber}/${subject}/select-questions${subjectId ? `?subjectId=${subjectId}` : ''}`}>
          <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Question Selection
          </Button>
        </Link>
        <div className="space-x-2">
          {hasChanges && (
            <Button 
              onClick={onSaveChanges} 
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowTemplatesModal(true)} className='h-10 px-8 cursor-pointer'>
            <BookTemplate className="mr-2 h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" onClick={onEdit} className='h-10 px-8 cursor-pointer'>
            <Edit className="mr-2 h-4 w-4" />
            Edit Paper
          </Button>
          <Button 
            variant="outline" 
            onClick={onPreview}
            className="h-10 px-8 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-lg"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview & Print
          </Button>
        </div>
      </div>
      <TemplatesModal 
        isOpen={showTemplatesModal} 
        onOpenChange={setShowTemplatesModal}
      />
    </div>
  );
};