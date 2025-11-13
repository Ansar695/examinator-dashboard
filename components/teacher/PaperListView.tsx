"use client";
import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  BookOpen,
  GraduationCap,
  Download,
  Eye,
  Trash2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/transformers/formatDate";

export const PaperListViewItem = ({ paper }: any) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-purple-500 to-pink-500 group-hover:w-2 transition-all duration-300" />

      <CardContent className="p-6 pl-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-1">
                  {paper.title}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20"
                  >
                    Class: {paper.class?.name}th
                  </Badge>
                  <Badge variant="outline" className="font-semibold px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    {paper.totalMarks} marks
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(new Date(paper.createdAt))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {paper.examTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {paper.mcqs?.length || 0}
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  MCQs
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {paper.shortQs?.length || 0}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Short
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {paper.longQs?.length || 0}
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Long
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="default"
              size="sm"
              className="font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
