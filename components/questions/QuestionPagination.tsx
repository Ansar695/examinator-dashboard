import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const QuestionPagination: React.FC<QuestionPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className="p-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {currentPage > 3 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageClick(1)}
            disabled={isLoading}
            className="px-3 py-1"
          >
            1
          </Button>
          {currentPage > 4 && <span className="px-2">...</span>}
        </>
      )}

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageClick(page)}
          disabled={isLoading}
          className={`px-3 py-1 ${
            currentPage === page
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : ""
          }`}
        >
          {page}
        </Button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageClick(totalPages)}
            disabled={isLoading}
            className="px-3 py-1"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className="p-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};