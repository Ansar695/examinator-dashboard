import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X, FileText, CheckSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PaperPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperData: any;
  board: string;
  classNumber: string;
  subject: string;
}

export const PaperPreviewModal: React.FC<PaperPreviewModalProps> = ({
  isOpen,
  onClose,
  paperData,
  board,
  classNumber,
  subject,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-family: Arial, sans-serif;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .bg-green-50 { background-color: #f0fdf4; }
        .border { border: 1px solid #e5e7eb; }
        .border-gray-300 { border-color: #d1d5db; }
        .border-green-200 { border-color: #bbf7d0; }
        .text-green-600 { color: #16a34a; }
        .text-green-800 { color: #166534; }
        .font-bold { font-weight: bold; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .text-sm { font-size: 0.875rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .uppercase { text-transform: uppercase; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-12 { margin-top: 3rem; }
        .ml-6 { margin-left: 1.5rem; }
        .mr-2 { margin-right: 0.5rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .pb-4 { padding-bottom: 1rem; }
        .pt-4 { padding-top: 1rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .rounded { border-radius: 0.25rem; }
        .border-b { border-bottom-width: 1px; }
        .border-b-2 { border-bottom-width: 2px; }
        .border-t { border-top-width: 1px; }
        .border-black { border-color: #000; }
        .border-dotted { border-style: dotted; }
        .border-gray-400 { border-color: #9ca3af; }
        .list-disc { list-style-type: disc; }
        .list-inside { list-style-position: inside; }
        .float-right { float: right; }
        .h-20 { height: 5rem; }
        .h-32 { height: 8rem; }
        .h-40 { height: 10rem; }
        .flex { display: flex; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .text-gray-600 { color: #4b5563; }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${subject} Paper - Class ${classNumber}${showAnswers ? ' (With Answers)' : ''}</title>
          ${styles}
        </head>
        <body style="margin:0; padding:10mm;">
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!paperData) return null;

  const formatBoardName = (boardSlug: string) => {
    return boardSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90%] max-w-[90%] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 no-print">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Paper Preview</DialogTitle>
            <div className="flex items-center gap-4 pr-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-answers"
                  checked={showAnswers}
                  onCheckedChange={setShowAnswers}
                  className='border border-gray-300 ta-[state=unchecked]:bg-gray-400'
                />
                <Label htmlFor="show-answers" className="text-sm font-medium">
                  Show Answers
                </Label>
              </div>
              <Button
                onClick={handlePrint}
                className="h-10 px-8 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-lg"
              >
                <Printer className="mr-2 h-5 w-5" />
                Print PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-gray-100 p-6">
          <div 
            ref={printRef}
            className="bg-white shadow-lg mx-auto"
            style={{ width: '210mm', minHeight: '297mm', padding: '25mm' }}
          >
            {/* Paper Header */}
            <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold uppercase mb-2">
                {formatBoardName(board)} Board
              </h1>
              <h2 className="text-xl font-semibold mb-2">
                {paperData.title || `${subject} Examination`}
              </h2>
              <div className="flex justify-between text-sm mt-4">
                <div className="text-left">
                  <p><strong>Class:</strong> {classNumber}</p>
                  <p><strong>Subject:</strong> {subject}</p>
                </div>
                <div className="text-right">
                  <p><strong>Time:</strong> {paperData.examTime || '3:00'} Hours</p>
                  <p><strong>Total Marks:</strong> {paperData.totalMarks}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
              <h3 className="font-bold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Attempt all questions</li>
                <li>Write your answers clearly and legibly</li>
                <li>Marks for each question are shown in brackets</li>
                <li>Use of calculator is not allowed unless specified</li>
              </ul>
            </div>

            {/* MCQs Section */}
            {paperData.mcqs && paperData.mcqs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 bg-gray-200 p-2">
                  SECTION A: Multiple Choice Questions 
                  <span className="float-right text-sm">
                    [{paperData.mcqs.reduce((sum: number, q: any) => sum + q.marks, 0)} Marks]
                  </span>
                </h3>
                <div className="space-y-4">
                  {paperData.mcqs.map((mcq: any, index: number) => (
                    <div key={mcq.questionId} className="mb-4">
                      <p className="font-medium mb-2">
                        Q{index + 1}. {mcq.question} 
                        <span className="float-right text-sm">[{mcq.marks} Mark]</span>
                      </p>
                      <div className="ml-6 space-y-1">
                        {mcq.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-start">
                            <span className="mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            <span className={showAnswers && mcq.correctAnswer === optIndex ? 'font-bold text-green-600' : ''}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      {showAnswers && mcq.correctAnswer !== undefined && (
                        <p className="ml-6 mt-2 text-green-600 font-medium">
                          Answer: {String.fromCharCode(65 + mcq.correctAnswer)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Short Questions Section */}
            {paperData.shortQs && paperData.shortQs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 bg-gray-200 p-2">
                  SECTION B: Short Answer Questions
                  <span className="float-right text-sm">
                    [{paperData.shortQs.reduce((sum: number, q: any) => sum + q.marks, 0)} Marks]
                  </span>
                </h3>
                <div className="space-y-4">
                  {paperData.shortQs.map((question: any, index: number) => (
                    <div key={question.questionId} className="mb-4">
                      <p className="font-medium">
                        Q{paperData.mcqs.length + index + 1}. {question.question}
                        <span className="float-right text-sm">[{question.marks} Marks]</span>
                      </p>
                      {showAnswers && question.answer && (
                        <div className="ml-6 mt-2 p-3 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-800">
                            <strong>Answer:</strong> {question.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Long Questions Section */}
            {paperData.longQs && paperData.longQs.length > 0 && (
              <div className="mb-8 page-break">
                <h3 className="text-lg font-bold mb-4 bg-gray-200 p-2">
                  SECTION C: Long Answer Questions
                  <span className="float-right text-sm">
                    [{paperData.longQs.reduce((sum: number, q: any) => sum + (q.totalMarks || 0), 0)} Marks]
                  </span>
                </h3>
                <div className="space-y-6">
                  {paperData.longQs.map((question: any, index: number) => (
                    <div key={question.questionId} className="mb-6">
                      <p className="font-medium mb-2">
                        Q{paperData.mcqs.length + paperData.shortQs.length + index + 1}. {question.question}
                        <span className="float-right text-sm">[{question.totalMarks} Marks]</span>
                      </p>
                      {question.parts && question.parts.length > 0 ? (
                        <div className="ml-6 space-y-3">
                          {question.parts.map((part: any, partIndex: number) => (
                            <div key={partIndex}>
                              <p className="font-medium">
                                {part.partLabel}) {part.question}
                                <span className="float-right text-sm">[{part.marks} Marks]</span>
                              </p>
                              {showAnswers && part.answer && (
                                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                                  <p className="text-sm text-green-800">
                                    <strong>Answer:</strong> {part.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {showAnswers && question.answer && (
                            <div className="ml-6 mt-2 p-3 bg-green-50 border border-green-200 rounded">
                              <p className="text-sm text-green-800">
                                <strong>Answer:</strong> {question.answer}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
              <p>*** End of Paper ***</p>
              <p className="mt-2">Good Luck!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};