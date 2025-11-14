"use client";
import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  BookOpen,
  GraduationCap,
  Eye,
  Trash2,
  Award,
  Edit,
  ChevronRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/transformers/formatDate";
import { useRouter } from "next/navigation";

export const PaperListViewItem = ({
  paper,
  handleViewPaper,
  handlePaperDelete,
}: any) => {
  const router = useRouter();
  const totalQuestions =
    (paper.mcqs?.length || 0) +
    (paper.shortQs?.length || 0) +
    (paper.longQs?.length || 0);

  const handleEditPaper = (paper: any) => {
    router.push(
      `/${paper?.board?.slug}/${paper?.class?.name}/${paper?.subject?.slug}/view-paper?paperId=${paper.id}&subjectId=${paper.subjectId}`
    );
  };

  return (
    <Card className="group relative overflow-hidden border-2 border-gray-200 hover:border-primary/40 dark:border-gray-800 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-950">
      {/* Left accent bar - animated on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-pink-500 group-hover:w-1.5 transition-all duration-300" />

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-purple-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative pl-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3
                  className="capitalize text-lg font-bold mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-1 group-hover:text-primary"
                  onClick={() => handleViewPaper(paper)}
                >
                  {paper.title}
                </h3>

                {/* Badges and Meta Info */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 text-xs font-bold shadow-sm">
                    Class {paper.class?.name}
                  </Badge>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      {paper.totalMarks} Marks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-medium">
                      {formatDate(paper.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{paper.examTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section - Horizontal pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* MCQs */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="p-1 rounded bg-blue-500/10 dark:bg-blue-500/20">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                  {paper.mcqs?.length || 0}
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  MCQs
                </span>
              </div>

              {/* Short Questions */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                <div className="p-1 rounded bg-emerald-500/10 dark:bg-emerald-500/20">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {paper.shortQs?.length || 0}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Short
                </span>
              </div>

              {/* Long Questions */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
                <div className="p-1 rounded bg-purple-500/10 dark:bg-purple-500/20">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-lg font-black text-purple-700 dark:text-purple-300">
                  {paper.longQs?.length || 0}
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Long
                </span>
              </div>

              {/* Total Questions */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Total:
                </span>
                <span className="text-lg font-black text-primary">
                  {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons Section */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="default"
              size="default"
              className="font-semibold cursor-pointer bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all group/btn"
              onClick={() => handleViewPaper(paper)}
            >
              <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              View
              <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="default"
              className="flex-1 cursor-pointer font-semibold border-2 hover:text-black hover:bg-primary/5 hover:border-primary transition-all"
              onClick={() => handleEditPaper(paper)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="default"
              className="flex-1 cursor-pointer font-semibold border-2 border-red-200 hover:text-red-500 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 transition-all"
              onClick={() => handlePaperDelete(paper?.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
