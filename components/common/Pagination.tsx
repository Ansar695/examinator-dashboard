"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  currentUsers: number;
  total?: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function CustomPagination({
  currentPage,
  currentUsers,
  total,
  totalPages,
  limit,
  onPageChange,
  isLoading = false,
}: PaginationProps) {

  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-gray-600">
        Showing {currentUsers} of {total} users
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
