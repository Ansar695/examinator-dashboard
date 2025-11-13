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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/transformers/formatDate";

export const PaperGridView = ({ paper }: any) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top colored bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

      <CardHeader className="relative pb-0 pt-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="capitalize text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {paper?.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
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
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(paper.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{paper.examTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-2 py-0">
        {/* Question Stats with modern design */}
        <div className="grid grid-cols-3 gap-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 border border-blue-200 dark:border-blue-800">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/10 rounded-full -mr-8 -mt-8" />
            {/* <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" /> */}
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {paper.mcqs?.length || 0}
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              MCQs
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/10 rounded-full -mr-8 -mt-8" />
            {/* <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" /> */}
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              {paper.shortQs?.length || 0}
            </div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Short
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 border border-purple-200 dark:border-purple-800">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/10 rounded-full -mr-8 -mt-8" />
            {/* <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" /> */}
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {paper.longQs?.length || 0}
            </div>
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Long
            </div>
          </div>
        </div>

        {/* Total Questions Summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-muted">
          <span className="text-sm font-medium text-muted-foreground">
            Total Questions
          </span>
          <span className="text-lg font-bold text-foreground">
            {(paper.mcqs?.length || 0) +
              (paper.shortQs?.length || 0) +
              (paper.longQs?.length || 0)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="relative bg-gradient-to-br from-muted/30 to-muted/50 flex gap-2 pt-0">
        <Button
          variant="default"
          size="sm"
          className="flex-1 font-semibold shadow-sm hover:shadow-md transition-shadow"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
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
      </CardFooter>
    </Card>
  );
};
